import { HTTPError } from "libs/types/http"

export async function tryfetch(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(input, init)
	if (!res.ok) throw await HTTPError.from(res)
	return res
}

export async function textfetch(input: RequestInfo, init?: RequestInit) {
	const res = await tryfetch(input, init)
	return await res.text()
}

export async function jsonfetch<T>(input: RequestInfo, init?: RequestInit) {
	const res = await tryfetch(input, init)
	return await res.json() as T
}

export async function datafetch<T>(input: RequestInfo, init?: RequestInit) {
	const json: any = await jsonfetch(input, init)
	if (json.error) throw new Error(json.error)
	return json.data as T
}

export function POST(init?: RequestInit): RequestInit {
	return { method: "POST", ...init }
}

export function asJson(json: unknown, init?: HeadersInit) {
	const headers = new Headers(init)
	headers.set("content-type", "application/json")
	const body = JSON.stringify(json)
	return { body, headers }
}