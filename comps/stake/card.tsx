import { TransactionResponse } from "@ethersproject/providers"
import { useCrypto } from "comps/crypto/context"
import { useData } from "comps/data/context"
import { useError } from "comps/dialogs/error"
import { EvolTable } from "comps/evol/table"
import { LogoIcon } from "comps/icons/logo"
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
import { Input } from "../input/input"

export function StakeCard() {
	const error = useError()
	const crypto = useCrypto()
	const dialog = useWalletDialog()
	const { balance } = useData()

	const input = useString()
	const amount = useOptionalHandle<BigNumber>()

	const [txHash, setTxHash] = useState<string>()

	const tryStake = useAsyncTry(async () => {
		if (!crypto) return

		const tomorrow = BigNumber.from(Date.now() + (24 * 60 * 60 * 1000))

		const signature = await crypto.permit({
			token: Tornado.TORN,
			spender: Tornado.Governance,
			amount: amount.current!,
			deadline: tomorrow
		})

		const tx: TransactionResponse = await Tornado.Governance
			.connect(crypto.signer)
			.lock(crypto.address, amount.current, tomorrow, signature.v, signature.r, signature.s)
		setTxHash(tx.hash)
		await tx.wait()
		input.unset()
		success.enable()
		setTimeout(success.disable, 5000)
		setTimeout(() => setTxHash(undefined), 5000)
	}, [crypto, amount], error.set)

	const canStake = useMemo(() => {
		if (!amount.current)
			return false
		if (!balance.data)
			return false
		if (amount.current.lte(0))
			return false
		if (amount.current.gt(balance.data))
			return false
		return true
	}, [amount.current, balance.data])

	const errorMessage = useMemo(() => {
		if (!amount.current)
			return "Please enter a valid amount"
		if (amount.current.lte(0))
			return "Please enter a valid amount"
		if (balance.data && amount.current.gt(balance.data))
			return "Insufficient TORN balance"
	}, [amount.current, balance.data])

	const ignore = useBoolean()
	const success = useBoolean(true)

	return <>
		{success.current && txHash &&
			<SuccessNotif
				close={success.disable}
				txHash={txHash} />}
		{tryStake.loading && !ignore.current && !txHash &&
			<Dialog close={ignore.enable}>
				<div className="text-xl p-md rounded-3xl font-montserrat flex flex-col flex-center">
					<div className="text-center">
						<div>Waiting for signature</div>
						<div>Please allow the transaction in your wallet...</div>
					</div>
					<LogoIcon className="text-colored icon-5xl animate-spin-reverse my-2" />
				</div>
			</Dialog>}
		{tryStake.loading && !ignore.current && txHash &&
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
			maximum={balance.data} />
		<div className="my-2 grow" />
		<EvolTable amount={amount.current} />
		<div className="my-2 grow" />
		{crypto ? <>
			<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
				onClick={tryStake.run}
				disabled={!canStake}>
				{errorMessage ?? "Stake"}
			</button>
		</> : <>
			<button className="w-full font-montserrat p-4 bg-transcolored ahover:bg-transcolored2 text-colored rounded-xl disabled:cursor-not-allowed disabled:bg-contrast disabled:text-contrast"
				onClick={dialog.enable}>
				Connect wallet
			</button>
		</>}
	</>
}