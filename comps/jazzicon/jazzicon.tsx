import createJazzicon from "@metamask/jazzicon"
import { useLazyState } from "libs/react/state"

export function Jazzicon(props: {
	size: number
	address: string
}) {
	const { size, address } = props

	const [jazzicon] = useLazyState<HTMLElement>(() => {
		const slice = address.slice(2, 10)
		const seed = parseInt(slice, 16)
		return createJazzicon(size, seed)
	}, [address, size])

	return <div className="contents"
		dangerouslySetInnerHTML={jazzicon && { __html: jazzicon.outerHTML }}
		style={{ height: size, width: size }} />
}