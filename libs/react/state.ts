import { DependencyList, Dispatch, SetStateAction, useEffect, useState } from "react"

export type State<T> = [T, Dispatch<SetStateAction<T>>]

export function useLazyState<T>(
	factory: () => T,
	deps: DependencyList
): State<T | undefined> {
	const [state, setState] = useState<T>()
	useEffect(() => {
		setState(factory())
	}, deps)
	return [state, setState]
}