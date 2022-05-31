import { InformationCircleIcon } from "@heroicons/react/outline"
import { useData } from "comps/data/context"
import { Modal } from "comps/modals/modal"
import { BigNumber } from "ethers"
import { tryFloat } from "libs/ethers/bignumber"
import { popperInfoOptions } from "libs/popper/popper"
import { useElement } from "libs/react/handles/element"
import { ntos } from "libs/types/number"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { usePopper } from "react-popper"

export function EvolTable(props: {
	amount: BigNumber | undefined
}) {
	const { amount } = props
	const { apr365 } = useData()

	const [monthly, yearly] = useMemo(() => {
		if (!apr365.data) return []

		const namount = tryFloat(amount)
		if (!namount) return []

		const evol = (apr365.data / 100)
		const monthly = namount * (1 + (evol / 12))
		const yearly = namount * (1 + evol)
		return [monthly, yearly]
	}, [amount, apr365.data])

	return <div className="p-md font-montserrat">
		<div className="w-full flex justify-between items-center">
			<span className="">Annual percentage rate</span>
			{(ntos(apr365.data, 1)) === "?" ?
				<div className="flex justify-end">
					<div className="w-[45px] bg-loading dark:bg-loading-dark2 rounded-xl animate-background h-5" />
				</div>
				: <span className="text-colored">
					{`${ntos(apr365.data, 1)} %`}
				</span>}
		</div>
		<div className="my-2" />
		<div className="w-full flex justify-between items-center">
			<div className="flex items-center gap-1">
				<Info />
				<span className="">TORN in one month</span>
			</div>
			<span className="text-colored">
				{`${ntos(monthly ?? 0, 1)} TORN`}
			</span>
		</div>
		<div className="my-2" />
		<div className="w-full flex justify-between items-center">
			<div className="flex items-center gap-1">
				<Info />
				<span className="">TORN in one year</span>
			</div>
			<span className="text-colored">
				{`${ntos(yearly ?? 0, 1)} TORN`}
			</span>
		</div>
	</div>
}

function Info() {
	const router = useRouter()

	const reference = useElement<HTMLElement>()
	const element = useElement<HTMLElement>()

	const popper = usePopper(
		reference.current,
		element.current,
		popperInfoOptions)

	const info = useMemo(() => {
		if (router.asPath.startsWith("/#/stake"))
			return "Prediction based on the amount you entered and on the average APR over the last year"
		if (router.asPath.startsWith("/#/unstake"))
			return "Prediction based on your staked amount and on the average APR over the last year"
	}, [router.asPath])

	return <>
		<div onClick={reference.use}
			onMouseEnter={reference.use}
			onMouseLeave={reference.unset}>
			<InformationCircleIcon className="icon-xs" />
		</div>
		{reference.current && <Modal>
			<div className="p-md bg-default border border-contrast text-opposite rounded-xl font-montserrat"
				ref={element.set}
				style={popper.styles.popper}
				{...popper.attributes.popper}>
				<span className="text-sm sm:text-base">
					{info}
				</span>
			</div>
		</Modal>
		}
	</>
}