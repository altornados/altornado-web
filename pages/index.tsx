import { ClaimCard } from "comps/claim/card"
import { useReady } from "comps/next/ready"
import { StakeCard } from "comps/stake/card"
import { UnstakeCard } from "comps/unstake/card"
import { WithRouterProps } from "next/dist/client/with-router"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Index() {
	const router = useRouter()
	const ready = useReady()

	if (!ready)
		return null

	if (router.asPath.startsWith("/#/stake"))
		return <StakeCard />

	if (router.asPath.startsWith("/#/unstake"))
		return <UnstakeCard />

	if (router.asPath.startsWith("/#/claim"))
		return <ClaimCard />

	return <Redirect router={router} />
}

function Redirect(props: WithRouterProps) {
	const { router } = props

	useEffect(() => {
		router.replace("/#/stake")
	}, [])

	return null
}
