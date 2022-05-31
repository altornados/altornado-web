import { isError } from "libs/types/error"
import { isString } from "libs/types/string"

export function ErrorPage(props: {
	error: unknown
}) {
	const { error } = props

	if (isError(error))
		return <>{error.message}</>
	if (isString(error))
		return <>{error}</>
	return <>An error occured</>
}