import { TypedDataDomain } from "@ethersproject/abstract-signer"
import { Web3Provider } from "@ethersproject/providers"
import detectEthereumProvider from "@metamask/detect-provider"
import { Dialog } from "comps/modals/dialog"
import { BigNumber, Contract } from "ethers"
import { splitSignature } from "ethers/lib/utils"
import { useAddress } from "libs/ethers/address"
import { useAsyncTry } from "libs/react/async"
import { CloseProps, PromiseProps } from "libs/react/props"
import { useEffect, useState } from "react"
import { CryptoHandle } from "./context"

export function MetamaskPromise(props: CloseProps & PromiseProps<CryptoHandle | undefined>) {
	const { ok, err, close } = props

	const [ethereum, setEthereum] = useState<any>()
	const [chain, setChain] = useState<string>()
	const [accounts, setAccounts] = useState<string[]>([])
	const address = useAddress(accounts[0])

	useEffect(() => {
		detectEthereumProvider()
			.then(setEthereum)
			.catch(err)
	}, [])

	const tryConnect = useAsyncTry(async () => {
		if (!ethereum) return
		await ethereum
			.request({ method: "eth_requestAccounts" })
			.then(setAccounts)
		await ethereum
			.request({ method: "eth_chainId" })
			.then(setChain)
		ethereum.on("accountsChanged", setAccounts)
		ethereum.on("chainChanged", setChain)
		return () => {
			ethereum.off("accountsChanged", setAccounts)
			ethereum.off("chainChanged", setChain)
		}
	}, [ethereum], err)

	useEffect(() => {
		if (ethereum) tryConnect.run()
	}, [ethereum])

	useEffect(() => {
		if (!ethereum || !address || !chain) return
		ok(new MetamaskCrypto(ethereum, address, chain, close))
		return () => void ok(undefined)
	}, [ethereum, address, chain])

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

export class MetamaskCrypto {
	readonly provider = new Web3Provider(this.ethereum, "any")
	readonly signer = this.provider.getSigner()

	constructor(
		readonly ethereum: any,
		readonly address: string,
		readonly chain: string,
		readonly disconnect: () => void
	) { }

	async switch(chainId: string) {
		await this.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId }],
		});
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