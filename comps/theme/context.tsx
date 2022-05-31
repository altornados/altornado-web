
import { useObjectMemo } from "libs/react/memo";
import { ChildrenProps } from "libs/react/props";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark"
export interface ThemeHandle {
	stored?: Theme
	browser?: Theme
	current?: Theme
	set(theme?: string): void
}

export const ThemeContext =
	createContext<ThemeHandle | undefined>(undefined)

export function useTheme() {
	return useContext(ThemeContext)!
}

export function ThemeProvider(props: ChildrenProps) {
	const [browser, setBrowser] = useState<Theme>()
	const [stored, setStored] = useState<Theme>()

	useEffect(() => {
		const stored = localStorage.getItem("theme")
		if (stored) setStored(JSON.parse(stored))

		const matcher = matchMedia('(prefers-color-scheme: dark)')
		const f = () => setBrowser(matcher?.matches ? "dark" : "light")

		matcher.addEventListener("change", f); f();
		return () => matcher.removeEventListener("change", f)
	}, [])

	const set = useCallback((theme?: Theme) => {
		if (theme)
			localStorage.setItem("theme", JSON.stringify(theme))
		else
			localStorage.removeItem("theme")
		setStored(theme)
	}, [])

	const current = useMemo(() => {
		return stored ?? browser
	}, [stored, browser])

	useEffect(() => {
		if (current === "dark") {
			document
				.querySelector("meta[name=theme-color]")
				?.setAttribute("content", "#000000")
			document.documentElement.classList.add("dark")
		}

		if (current === "light") {
			document
				.querySelector("meta[name=theme-color]")
				?.setAttribute("content", "#ffffff")
			document.documentElement.classList.remove("dark")
		}
	}, [current])

	const handle = useObjectMemo({ stored, browser, current, set })

	return <ThemeContext.Provider value={handle}>
		{props.children}
	</ThemeContext.Provider>
}