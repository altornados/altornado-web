import { wrap } from "libs/api/wrap"
import { tryFloat, tryParse } from "libs/ethers/bignumber"
import { asJson, jsonfetch, POST } from "libs/fetch/fetch"
import { isError } from "libs/types/error"
import { BadGateway, BadRequest } from "libs/types/http"
import { tryIntegerOrThrow } from "libs/types/number"
import { NextApiRequest, NextApiResponse } from "next"

export default wrap(route)

async function route(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET")
		return await get(req, res)
	throw new BadRequest()
}

interface Result<T> {
	data: T
}

interface Day {
	amountBurned: string,
	vaultBalance: string
}

const daysQuery = (days: number) => `query {
	days(first: ${days}, skip: 1, orderBy: id, orderDirection: desc) {
		id
		amountBurned
		vaultBalance
	}
}`

function apr(day: Day) {
	const burned = tryFloat(tryParse(day.amountBurned))
	const balance = tryFloat(tryParse(day.vaultBalance))
	if (burned === undefined) return 0
	if (balance === undefined) return 0
	return (burned / balance) * 365
}

function average(array: number[]) {
	return array.reduce((a, b) => a + b, 0) / array.length
}

async function get(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("Cache-Control", "max-age=0, s-maxage=3600")

	const days = tryIntegerOrThrow(req.query.days, BadRequest)

	if (days !== 7 && days !== 30 && days !== 365)
		throw new BadRequest()

	try {
		type R = Result<{ days: Day[] }>
		const result = await jsonfetch<R>(
			"https://api.thegraph.com/subgraphs/name/altornados/tornado",
			POST(asJson({ query: daysQuery(days) })))
		return average(result.data.days.map(apr)) * 100
	} catch (e: unknown) {
		if (!isError(e)) throw e
		throw new BadGateway(e.message)
	}
}