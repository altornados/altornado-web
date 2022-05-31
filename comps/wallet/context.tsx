import { BooleanHandle, useBoolean } from "libs/react/handles/boolean"
import { ChildrenProps } from "libs/react/props"
import { createContext, useContext } from "react"

export const WalletDialogContext =
	createContext<BooleanHandle | undefined>(undefined)

export function useWalletDialog() {
	return useContext(WalletDialogContext)!
}

export function WalletDialogProvider(props: ChildrenProps) {
	const { children } = props
	const dialog = useBoolean()

	return <WalletDialogContext.Provider value={dialog}>
		{children}
	</WalletDialogContext.Provider>
}