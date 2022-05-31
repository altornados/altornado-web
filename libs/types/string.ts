
export function isString(x: unknown): x is string {
	return typeof x === "string"
}

export function asStringOr<T>(x: unknown, or: T) {
	return isString(x) ? x : or
}

export function asStringOrThrow(x: unknown, Error: new () => Error) {
	if (isString(x)) return x
	else throw new Error()
}
