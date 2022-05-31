export function api(path: string) {
	if (process.env.NEXT_PUBLIC_API)
		return process.env.NEXT_PUBLIC_API + path
	return "/api" + path
}