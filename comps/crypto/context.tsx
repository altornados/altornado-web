import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { useError } from "comps/dialogs/error";
import { Dialog } from "comps/modals/dialog";
import { useWalletDialog } from "comps/wallet/context";
import { WalletDialog } from "comps/wallet/dialog";
import { BigNumber, Contract, Signature } from "ethers";
import { useBoolean } from "libs/react/handles/boolean";
import { useStoredHandle } from "libs/react/handles/handle";
import { ChildrenProps } from "libs/react/props";
import { createContext, useCallback, useContext, useState } from "react";
import { MetamaskPromise } from "./metamask";
import { WConnectPromise } from "./wconnect";

export interface CryptoHandle {
	readonly address: string
	readonly chain: string

	readonly provider: JsonRpcProvider
	readonly signer: JsonRpcSigner

	switch(chain: string): Promise<void>

	permit(params: {
		token: Contract,
		spender: Contract,
		amount: BigNumber,
		deadline: BigNumber
	}): Promise<Signature>

	disconnect(): void
}

export interface CryptoProps {
	crypto: CryptoHandle
}

export const CryptoContext =
	createContext<CryptoHandle | undefined>(undefined)

export function useCrypto() {
	return useContext(CryptoContext)
}

type Connector = "metamask" | "walletconnect"

export function CryptoProvider(props: ChildrenProps) {
	const { children } = props
	const error = useError()
	const dialog = useWalletDialog()

	const connector = useStoredHandle<Connector>("connector")

	const metamask = useCallback(() => {
		connector.set("metamask")
		dialog.disable()
	}, [])

	const walletconnect = useCallback(() => {
		connector.set("walletconnect")
		dialog.disable()
	}, [])

	const [crypto, setCrypto] = useState<CryptoHandle>()

	const onError = useCallback((e: Error) => {
		error.set(e)
		connector.unset()
	}, [])

	const ignoreChain = useBoolean()

	const switchMain = useCallback(() => {
		if (crypto) crypto.switch("0x1")
	}, [crypto])

	return <>
		{dialog.current &&
			<WalletDialog
				close={dialog.disable}
				metamask={metamask}
				walletconnect={walletconnect} />}
		{connector.current === "metamask" &&
			<MetamaskPromise
				close={connector.unset}
				ok={setCrypto}
				err={onError} />}
		{connector.current === "walletconnect" &&
			<WConnectPromise
				close={connector.unset}
				ok={setCrypto}
				err={onError} />}
		{crypto && crypto.chain !== "0x1" && !ignoreChain.current &&
			<Dialog close={ignoreChain.enable}>
				<h1 className="text-2xl font-montserrat">
					Wrong network
				</h1>
				<div className="text-contrast font-montserrat">
					You are not connected to Ethereum Mainnet.
				</div>
				<div className="my-2" />
				<button className="w-full p-md font-montserrat rounded-xl border border-contrast ahover:border-opposite transition-colors"
					onClick={switchMain}>
					Switch network
				</button>
			</Dialog>}
		<CryptoContext.Provider value={crypto}>
			{children}
		</CryptoContext.Provider>
	</>
}