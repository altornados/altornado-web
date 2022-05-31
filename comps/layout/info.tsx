import { CryptoProps, useCrypto } from "comps/crypto/context"
import { WalletInfo } from "comps/crypto/dialog"
import { useData } from "comps/data/context"
import { Jazzicon } from "comps/jazzicon/jazzicon"
import { useFloat } from "libs/ethers/bignumber"
import { useBoolean } from "libs/react/handles/boolean"
import { ntos } from "libs/types/number"

export function LayoutInfo() {
	const crypto = useCrypto()
	const { balance, rewards, lockeds } = useData()

	const fbalance = useFloat(balance.data)
	const frewards = useFloat(rewards.data)
	const flockeds = useFloat(lockeds.data)

	if (crypto === undefined)
		return <div className="p-8 h-[180px] flex flex-col flex-center">
			<div className="flex flex-center text-center">
				<span className="text-xl lg:text-2xl font-montserrat">Welcome to</span>
				<span className="text-xl lg:text-2xl text-colored font-comfortaa whitespace-pre pt-[2px]"> altornado </span>
				<span className="text-xl lg:text-xl">🚀</span>
			</div>
			<div className="my-2" />
			<div className="flex flex-center text-center">
				<span className="lg:text-lg font-montserrat">Connect your wallet and start staking TORN</span>
			</div>
		</div>

	return <div className="p-8 h-[180px] grid grid-cols-2 gap-4 font-montserrat text-xs xs:text-base">
		<div className="flex flex-col justify-center items-stretch text-left">
			<span className="">
				Available to stake
			</span>
			{!balance.data
				? <div className="w-full h-7 bg-loading dark:bg-loading-dark rounded-xl animate-background" />
				: <div className="font-titillium text-base xs:text-lg font-semibold text-colored">
					<span>{ntos(fbalance, 1)}</span>
					<span className="whitespace-pre"> TORN</span>
				</div>}
		</div>
		<div className="flex flex-col justify-center items-end">
			<WalletButton crypto={crypto} />
		</div>
		<div className="flex flex-col justify-center items-stretch text-left">
			<span className="">
				Staked amount
			</span>
			{!lockeds.data
				? <div className="w-full h-7 bg-loading dark:bg-loading-dark rounded-xl animate-background" />
				: <div className="font-titillium text-base xs:text-lg font-semibold text-colored">
					<span>{ntos(flockeds, 1)}</span>
					<span className="whitespace-pre"> TORN</span>
				</div>}
		</div>
		<div className="flex flex-col justify-center items-stretch text-right">
			<span className="">
				Reward available
			</span>
			{!rewards.data
				? <div className="w-full h-7 bg-loading dark:bg-loading-dark rounded-xl animate-background" />
				: <div className="font-titillium text-base xs:text-lg font-semibold text-colored">
					<span>{ntos(frewards, 1)}</span>
					<span className="whitespace-pre"> TORN</span>
				</div>}
		</div>
	</div>
}

function WalletButton(props: CryptoProps) {
	const { crypto } = props

	const dialog = useBoolean()

	return <>
		{dialog.current &&
			<WalletInfo
				close={dialog.disable}
				address={crypto.address} />}
		<button className="flex items-center gap-2 p-md rounded-full bg-contrast"
			onClick={dialog.enable}>
			<Jazzicon size={20}
				address={crypto.address} />
			<div className="">
				{`${crypto.address.slice(0, 4)}...${crypto.address.slice(-4)}`}
			</div>
		</button>
	</>
}