import { useCallback, useState } from "react"
import { useObjectMemo } from "../memo"
import { useStoredState } from "../storage"

export interface Handle<T> {
	current: T
	set(x: T): void
}

export function useHandle<T>(init: T) {
	const [current, set] = useState(init)
	return useObjectMemo({ current, set })
}

export interface OptionalHandle<T> {
	current?: T
	set(x?: T): void
	unset(): void
}

export function useOptionalHandle<T>(init?: T) {
	const [current, set] = useState(init)
	const unset = useCallback(() => set(undefined), [])
	return useObjectMemo({ current, set, unset })
}

export function useStoredHandle<T>(key: string, def?: T) {
	const [current, set] = useStoredState(key, def)
	const unset = useCallback(() => set(undefined), [])
	return useObjectMemo({ current, set, unset })
}
