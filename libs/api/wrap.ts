import { isError } from "libs/types/error"
import { isHTTPError } from "libs/types/http"
import { NextApiRequest, NextApiResponse } from "next"

export function wrap<T>(router: (req: NextApiRequest, res: NextApiResponse) => Promise<T>) {
	return async function wrapper(req: NextApiRequest, res: NextApiResponse) {
		try {
			res.setHeader("Access-Control-Allow-Origin", "*")

			const result = await router(req, res)
			res.json({ data: result })
		} catch (e: unknown) {
			if (!isError(e))
				throw e
			if (isHTTPError(e))
				return res.status(e.code).send(e.message)
			return res.json({ error: e.message })
		}
	}
}