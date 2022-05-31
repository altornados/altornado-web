import { useMemo } from "react"

export function useObjectMemo<T>(object: T) {
	return useMemo(() => object, Object.values(object))
}
