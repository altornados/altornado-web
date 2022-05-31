import { ChangeEvent, DependencyList, KeyboardEvent, MouseEvent, SyntheticEvent, useCallback } from "react"

export function keep(e: SyntheticEvent<any>) {
	e.stopPropagation()
}

export function useInputChange<R>(
	callback: (e: ChangeEvent<HTMLInputElement>) => R,
	deps: DependencyList = [callback]
) {
	return useCallback(callback, deps)
}

export function useMouse<T = HTMLElement>(
	callback: (e: MouseEvent<T>) => void,
	deps: DependencyList = [callback]
) {
	return useCallback(callback, deps)
}

export function useKeyboard<T = HTMLElement>(
	callback: (e: KeyboardEvent<T>) => void,
	deps: DependencyList = [callback]
) {
	return useCallback(callback, deps)
}

export function useKeyboardEscape<T = HTMLElement>(
	callback: (e: KeyboardEvent<T>) => void,
	deps: DependencyList = [callback]
) {
	return useKeyboard((e: KeyboardEvent<T>) => {
		if (e.key !== "Escape") return
		e.preventDefault()
		e.stopPropagation()
		callback(e)
	}, deps)
}