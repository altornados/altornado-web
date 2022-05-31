import { useRef } from "react"

export function useStatic<T>(factory: () => T) {
	const ref = useRef<T>()
	if (ref.current === undefined)
		ref.current = factory()
	return ref.current
}
