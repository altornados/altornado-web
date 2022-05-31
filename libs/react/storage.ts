import { SetStateAction, useCallback, useEffect, useState } from "react"
import { State } from "./state"

export function useStoredState<T>(key: string, def?: T): State<T | undefined> {
	const [state, setState] = useState<T | undefined>(def)

	const getter = useCallback(() => {
		const item = localStorage.getItem(key)
		return item ? JSON.parse(item) : def
	}, [key])

	useEffect(() => {
		setState(getter())
	}, [getter])

	const setter = useCallback((action: SetStateAction<T | undefined>) => {
		const value = action instanceof Function
			? action(getter())
			: action
		const item = value !== undefined
			? JSON.stringify(value)
			: undefined
		if (item)
			localStorage.setItem(key, item)
		else
			localStorage.removeItem(key)
		setState(value)
	}, [key, getter])

	return [state, setter]
}