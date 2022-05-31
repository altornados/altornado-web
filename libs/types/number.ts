export function isNumber(x: unknown): x is number {
	return typeof x === "number"
}

export function isInteger(x: unknown): x is number {
	return isNumber(x) && Number.isSafeInteger(x) && x >= 0
}

export function asIntegerOrThrow(x: unknown, Error: new () => Error) {
	if (isInteger(x)) return x
	else throw new Error()
}

export function tryIntegerOrThrow(x: unknown, Error: new () => Error) {
	return asIntegerOrThrow(Number(x), Error)
}

export function ntos(x?: number, maximumFractionDigits = 3) {
	if (!isNumber(x))
		return "?"
	if (x >= (10 ** 7))
		return "?"
	if (x >= (10 ** 4))
		return x.toLocaleString("en-US", { maximumFractionDigits, notation: "compact" })
	return x.toLocaleString("en-US", { maximumFractionDigits })
}