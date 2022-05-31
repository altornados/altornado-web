export class HTTPError extends Error {
	constructor(
		readonly code: number,
		readonly text: string
	) {
		super(`${code}: ${text}`)
	}

	static async from(res: Response) {
		const text = await res.text()
		return new this(res.status, text)
	}
}

export function isHTTPError(e: unknown): e is HTTPError {
	return e instanceof HTTPError
}

export class Unauthorized extends HTTPError {
	constructor(msg = "Unauthorized") { super(401, msg) }
}

export class Forbidden extends HTTPError {
	constructor(msg = "Forbidden") { super(403, msg) }
}

export class NotFound extends HTTPError {
	constructor(msg = "Not found") { super(404, msg) }
}

export class BadRequest extends HTTPError {
	constructor(msg = "Bad request") { super(400, msg) }
}

export class Gone extends HTTPError {
	constructor(msg = "Gone") { super(410, msg) }
}

export class BadGateway extends HTTPError {
	constructor(msg = "Bad gateway") { super(502, msg) }
}