import { TransactionResponse } from "@ethersproject/providers"
import { useCrypto } from "comps/crypto/context"
import { useData } from "comps/data/context"
import { useError } from "comps/dialogs/error"
import { LogoIcon } from "comps/icons/logo"
import { Dialog } from "comps/modals/dialog"
import { Anchor } from "comps/next/anchor"
import { SuccessNotif } from "comps/notifs/success"
import { useWalletDialog } from "comps/wallet/context"
import { useFloat } from "libs/ethers/bignumber"
import { Tornado } from "libs/ethers/tornado/tornado"
import { useAsyncTry } from "libs/react/async"
import { useBoolean } from "libs/react/handles/boolean"
import { ntos } from "libs/types/number"
import { useMemo, useState } from "react"

export function ClaimCard() {
	const error = useError()
	const crypto = useCrypto()
	const dialog = useWalletDialog()
	const { rewards } = useData()

	const [txHash, setTxHash] = useState<string>()

	const tryClaim = useAsyncTry(async () => {
		if (!crypto) return
		const tx: TransactionResponse = await Tornado.Staking
			.connect(crypto.signer)
			.getReward()
		setTxHash(tx.hash)
		await tx.wait()
		success.enable()
		setTimeout(success.disable, 5000)
		setTimeout(() => setTxHash(undefined), 5000)
	}, [crypto], error.set)

	const canClaim = useMemo(() => {
		if (!rewards.data) return false
		if (rewards.data.lte(0)) return false
		return true
	}, [rewards.data])

	const ignore = useBoolean()
	const success = useBoolean()

	const frewards = useFloat(rewards.data)

	return <>
		{success.current && txHash &&
			<SuccessNotif
				close={success.disable}
				txHash={txHash} />}
		{tryClaim.loading && !ignore.current && !txHash &&
			<Dialog close={ignore.enable}>
				<div className="text-xl p-md rounded-3xl font-montserrat flex flex-col flex-center">
					<div className="text-center">
						<div>Waiting for signature</div>
						<div>Please allow the transaction in your wallet...</div>
					</div>
					<LogoIcon className="text-colored icon-5xl animate-spin-reverse my-2" />
				</div>
			</Dialog>}
		{tryClaim.loading && !ignore.current && txHash &&
			<Dialog close={ignore.enable}>
				<div className="text-xl p-md rounded-3xl font-montserrat flex flex-col flex-center">
					<div className="text-center">
						<div>Transaction sent !</div>
						<div>Pending network validation...</div>
					</div>
					<a className="block text-colored text-base anchor"
						href={`https://etherscan.io/tx/${txHash}`}
						target="_blank" rel="noreferrer">
						View on Etherscan
					</a>
					<LogoIcon className="text-colored icon-5xl animate-spin-reverse my-2" />
				</div>
			</Dialog>}
		<div className="grow flex flex-col justify-center">
			<div className="px-2 font-montserrat">
				{crypto && rewards.data && rewards.data.gt(0) && <>
					<div className="text-xl font-medium text-center">
						It's time to get your money 💰
					</div>
					<div className="my-4" />
					<div className="text-center">
						<span className="">
							Enjoy your
						</span>
						<span className="font-bold">
							{` ${ntos(frewards, 1)} TORN `}
						</span>
						<span className="">
							reward! We hope to see you again soon
						</span>
					</div>
				</>}
				{crypto && rewards.data && rewards.data.eq(0) && <>
					<div className="text-xl font-medium text-center">
						Oh wait, you don't have any reward 😅
					</div>
					<div className="my-4" />
					<div className="text-center">
						<span className="whitespace-pre">
							Go stake
						</span>
						<Anchor className="text-colored anchor mx-1"
							href="/#/stake">
							{`here`}
						</Anchor>
						<span className="text-center">
							and come back later to claim it
						</span>
					</div>
				</>}
				{!crypto && <>
					<div className="text-xl font-medium text-center">
						Oh wait, your wallet is not connected 🔐
					</div>
					<div className="my-4" />
					<div className="text-center">
						<span className="">
							{`Log in `}
						</span>
						<button className="text-colored anchor"
							onClick={dialog.enable}>
							{`here`}
						</button>
						<span className="">
							{` and find out if your reward is ready`}
						</span>
					</div>
				</>}
			</div>
		</div>
		{crypto ? <>
			<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
				onClick={tryClaim.run}
				disabled={!canClaim}>
				Claim
			</button>
		</> : <>
			<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
				onClick={dialog.enable}>
				Connect wallet
			</button>
		</>}
	</>
}
