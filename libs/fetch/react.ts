import { useObjectMemo } from "libs/react/memo";
import { DependencyList, useCallback, useEffect, useState } from "react";

export interface FetchHandle<T> {
	data?: T,
	error?: Error
	loading: boolean
	fetch(): void
}

export function useFetch<T>(
	fetcher: () => Promise<T>,
	deps: DependencyList
): FetchHandle<T> {
	const [data, setData] = useState<T>()
	const [error, setError] = useState<Error>()
	const [loading, setLoading] = useState(false)

	const fetch = useCallback(() => {
		setLoading(true)
		fetcher()
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false))
	}, deps)

	useEffect(() => {
		fetch()
	}, [fetch])

	return useObjectMemo({ data, error, loading, fetch })
}