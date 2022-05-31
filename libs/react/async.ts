import { DependencyList, useCallback, useState } from "react"

export function useAsyncTry<R, A extends unknown[]>(
	subcallback: (...args: A) => Promise<R>,
	deps: DependencyList,
	onerror: (e: any) => void
) {
	const [loading, setLoading] = useState(false)

	const run = useCallback(async (...args: A) => {
		if (loading) return
		setLoading(true)
		return await subcallback(...args)
			.catch((e) => onerror(e))
			.finally(() => setLoading(false))
	}, [...deps, loading, onerror])

	return { run, loading }
}