import { Dialog } from "comps/modals/dialog"
import { OptionalHandle, useOptionalHandle } from "libs/react/handles/handle"
import { ChildrenProps } from "libs/react/props"
import { createContext, useContext, useEffect } from "react"

export const ErrorContext =
	createContext<OptionalHandle<Error> | undefined>(undefined)

export function useError() {
	return useContext(ErrorContext)!
}

export function ErrorProvider(props: ChildrenProps) {
	const error = useOptionalHandle<Error>()

	useEffect(() => {
		if (error.current) console.error(error.current)
	}, [error.current])

	return <ErrorContext.Provider value={error}>
		{error.current &&
			<Dialog close={error.unset}>
				<div className="flex flex-center">
					<img className="w-8 h-8 mr-2"
						src="/assets/cross.svg" />
					<h1 className="text-2xl font-montserrat">
						An error occured :
					</h1>
				</div>
				<div className="text-contrast text-center font-montserrat whitespace-pre-wrap">
					{error.current.message}
				</div>
			</Dialog>}
		{props.children}
	</ErrorContext.Provider>
}

