import { AnchorProps, RefProps } from "libs/react/props"
import Link, { LinkProps } from "next/link"

export function Anchor(props: AnchorProps & LinkProps & RefProps<HTMLAnchorElement>) {
	const { xref, href, scroll, ...others } = props
	if (!href) return <a {...others} />

	return <Link href={href} scroll={scroll} passHref>
		<a ref={xref} {...others} />
	</Link>
}