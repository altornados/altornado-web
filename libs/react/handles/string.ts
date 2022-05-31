import { useCallback, useState } from "react"
import { useObjectMemo } from "../memo"

export interface StringHandle {
	current: string
	set(x?: string): void
	unset(): void
}

export function useString(init?: string) {
	const [current = "", set] = useState(init)
	const unset = useCallback(() => set(undefined), [])
	return useObjectMemo({ current, set, unset })
}
