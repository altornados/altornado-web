
import { Anchor } from "comps/next/anchor"
import { useReady } from "comps/next/ready"
import { ElementHandle, useElement } from "libs/react/handles/element"
import { AnchorProps } from "libs/react/props"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"

export function LayoutNavbar() {
	const activeElement = useElement()

	const navigation = useRef<HTMLDivElement>(null)

	const [pageWidth, setPageWidth] = useState<number>()

	useEffect(() => {
		const f = () => setPageWidth(window.innerWidth)
		addEventListener("resize", f)
		return () => removeEventListener("resize", f)
	}, [])

	const [start, width] = useMemo(() => {
		if (!activeElement.current) return [0, 0]
		const arect = activeElement.current.getBoundingClientRect()
		const nrect = navigation.current!.getBoundingClientRect()
		return [arect.left - nrect.left, arect.width]
	}, [activeElement.current, pageWidth])

	return <nav className="p-md w-full max-w-[400px] m-auto">
		<div className="p-1 w-full bg-contrast rounded-full">
			<div className="relative flex items-center"
				ref={navigation}>
				{activeElement.current &&
					<div className={`absolute h-full p-md rounded-full text-colored bg-default dark:bg-white dark:bg-opacity-5 transition-all`}
						style={{ transform: `translateX(${start}px)`, width }} />}
				<Button
					href="/#/stake"
					activeElement={activeElement}>
					Stake
				</Button>
				<Button
					href="/#/unstake"
					activeElement={activeElement}>
					Unstake
				</Button>
				<Button href="/#/claim"
					activeElement={activeElement}>
					Claim
				</Button>
			</div>
		</div>
	</nav>
}

function Button(props: AnchorProps & {
	activeElement: ElementHandle
}) {
	const { activeElement, href, children } = props
	const router = useRouter()
	const ready = useReady()

	const element = useRef<HTMLAnchorElement>(null)

	const current = true
		&& href && ready
		&& router.asPath.startsWith(href)

	useEffect(() => {
		if (current) activeElement.set(element.current)
	}, [current])

	const color = current
		? "text-colored"
		: "ahover:text-colored focus-visible:text-colored"

	return <Anchor className={`p-md z-10 flex-1 font-montserrat w-full font-semibold rounded-full ${color} transition-colors`}
		scroll={false}
		href={href!}
		xref={element}>
		<span className={`flex flex-center text-center`}>
			{children}
		</span>
	</Anchor>
}
