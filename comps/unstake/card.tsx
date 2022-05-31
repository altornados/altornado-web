import { TransactionResponse } from "@ethersproject/providers"
import { useCrypto } from "comps/crypto/context"
import { useData } from "comps/data/context"
import { useError } from "comps/dialogs/error"
import { EvolTable } from "comps/evol/table"
import { LogoIcon } from "comps/icons/logo"
import { Input } from "comps/input/input"
import { Dialog } from "comps/modals/dialog"
import { SuccessNotif } from "comps/notifs/success"
import { useWalletDialog } from "comps/wallet/context"
import { BigNumber } from "ethers"
import { Tornado } from "libs/ethers/tornado/tornado"
import { useAsyncTry } from "libs/react/async"
import { useBoolean } from "libs/react/handles/boolean"
import { useOptionalHandle } from "libs/react/handles/handle"
import { useString } from "libs/react/handles/string"
import { useMemo, useState } from "react"

export function UnstakeCard() {
	const error = useError()
	const crypto = useCrypto()
	const dialog = useWalletDialog()
	const { lockeds } = useData()

	const input = useString()
	const amount = useOptionalHandle<BigNumber>()

	const [txHash, setTxHash] = useState<string>()

	const tryUnstake = useAsyncTry(async () => {
		if (!crypto) return
		const tx: TransactionResponse = await Tornado.Governance
			.connect(crypto.signer)
			.unlock(amount.current)
		setTxHash(tx.hash)
		await tx.wait()
		input.unset()
		success.enable()
		setTimeout(success.disable, 5000)
		setTimeout(() => setTxHash(undefined), 5000)
	}, [crypto, amount], error.set)

	const canUnstake = useMemo(() => {
		if (!amount.current)
			return false
		if (!lockeds.data)
			return false
		if (amount.current.lte(0))
			return false
		if (amount.current.gt(lockeds.data))
			return false
		return true
	}, [amount.current, lockeds.data])

	const errorMessage = useMemo(() => {
		if (!amount.current)
			return "Please enter a valid amount"
		if (amount.current.lte(0))
			return "Please enter a valid amount"
		if (lockeds.data && amount.current.gt(lockeds.data))
			return "Insufficient TORN staked"
	}, [amount.current, lockeds.data])

	const ignore = useBoolean()
	const success = useBoolean()

	return <>
		{success.current && txHash &&
			<SuccessNotif
				close={success.disable}
				txHash={txHash} />}
		{tryUnstake.loading && !ignore.current && !txHash &&
			<Dialog close={ignore.enable}>
				<div className="text-xl p-md rounded-3xl font-montserrat flex flex-col flex-center">
					<div className="text-center">
						<div>Waiting for signature</div>
						<div>Please allow the transaction in your wallet...</div>
					</div>
					<LogoIcon className="text-colored icon-5xl animate-spin-reverse my-2" />
				</div>
			</Dialog>}
		{tryUnstake.loading && !ignore.current && txHash &&
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
		<Input
			input={input}
			amount={amount}
			maximum={lockeds.data} />
		<div className="my-2 grow" />
		<EvolTable amount={lockeds.data} />
		<div className="my-2 grow" />
		{crypto ? <>
			<div className="w-full">
				<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
					onClick={tryUnstake.run}
					disabled={!canUnstake}>
					{errorMessage ?? "Unstake"}
				</button>
			</div>
		</> : <>
			<div className="w-full">
				<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
					onClick={dialog.enable}>
					Connect wallet
				</button>
			</div>
		</>}
	</>
}
