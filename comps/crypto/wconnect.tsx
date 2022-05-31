import { TypedDataDomain } from "@ethersproject/abstract-signer"
import { InfuraProvider, Web3Provider } from "@ethersproject/providers"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { Dialog } from "comps/modals/dialog"
import { BigNumber, Contract } from "ethers"
import { splitSignature } from "ethers/lib/utils"
import { useAddress } from "libs/ethers/address"
import { useAsyncTry } from "libs/react/async"
import { CloseProps, PromiseProps } from "libs/react/props"
import { useStatic } from "libs/react/static"
import { useEffect, useMemo, useState } from "react"
import { CryptoHandle } from "./context"

export function WConnectPromise(props: CloseProps & PromiseProps<CryptoHandle | undefined>) {
	const { ok, err, close } = props

	const provider = useStatic(() => new WalletConnectProvider({
		rpc: { 1: new InfuraProvider().connection.url }
	}))

	const [chainId, setChainId] = useState<number>()
	const [accounts, setAccounts] = useState(provider?.accounts)
	const address = useAddress(accounts?.[0])

	const tryConnect = useAsyncTry(async () => {
		if (!provider) return
		setAccounts(await provider.enable())
		setChainId(provider.chainId)
	}, [provider], err)

	const tryDisconnect = useAsyncTry(async () => {
		if (!provider) return
		await provider.disconnect()
	}, [provider], err)

	useEffect(() => {
		if (!provider) return
		provider.on("accountsChanged", setAccounts)
		provider.on("chainChanged", setChainId)
		provider.on("disconnect", () => close())
		if (!provider.connected)
			tryConnect.run().catch(err)
		return () => void tryDisconnect.run()
	}, [provider])

	const chain = useMemo(() => {
		if (chainId === 1) return "0x1"
	}, [chainId])

	useEffect(() => {
		if (!provider || !address || !chain) return
		ok(new WConnectCrypto(provider, address, chain, close))
		return () => void ok(undefined)
	}, [provider, address, chain])

	if (tryConnect.loading)
		return <Dialog close={close}>
			<h1 className="text-2xl font-montserrat text-center">
				Connecting...
			</h1>
			<div className="text-contrast font-montserrat text-center">
				Please allow our app to connect to your wallet
			</div>
		</Dialog>

	return null
}

export class WConnectCrypto implements CryptoHandle {
	readonly provider = new Web3Provider(this.wconnect)
	readonly signer = this.provider.getSigner()

	constructor(
		readonly wconnect: WalletConnectProvider,
		readonly address: string,
		readonly chain: string,
		readonly disconnect: () => void
	) { }

	async switch(chain: string) {
		await this.wconnect.connector.updateChain({
			chainId: 1,
			networkId: 1,
			rpcUrl: new InfuraProvider().connection.url,
			nativeCurrency: {
				name: "Ethereum",
				symbol: "ETH"
			}
		})
	}

	async permit(params: {
		token: Contract,
		spender: Contract,
		amount: BigNumber,
		deadline: BigNumber
	}) {
		const { token, spender, amount, deadline } = params

		const name: string = await token
			.connect(this.signer)
			.name()
		const nonce: BigNumber = await token
			.connect(this.signer)
			.nonces(this.address)

		const domain: TypedDataDomain = {
			name: name,
			chainId: 1,
			version: '1',
			verifyingContract: token.address
		}

		const types = {
			Permit: [
				{ name: 'owner', type: 'address' },
				{ name: 'spender', type: 'address' },
				{ name: 'value', type: 'uint256' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint256' },
			]
		}

		const data = {
			owner: this.address,
			spender: spender.address,
			value: amount,
			nonce: nonce,
			deadline: deadline,
		}

		const result = await this.signer
			._signTypedData(domain, types, data)
		return splitSignature(result)
	}
}