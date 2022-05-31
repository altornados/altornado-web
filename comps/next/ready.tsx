import { ChildrenProps } from "libs/react/props"
import { useLazyState } from "libs/react/state"
import { createContext, useContext } from "react"

export const ReadyContext =
	createContext<boolean | undefined>(undefined)

export function useReady() {
	return useContext(ReadyContext)
}

export function ReadyProvider(props: ChildrenProps) {
	const [ready] = useLazyState(() => true, [])

	return <ReadyContext.Provider value={ready}>
		{props.children}
	</ReadyContext.Provider>
}