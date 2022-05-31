import { useCrypto } from "comps/crypto/context"
import { LogoIcon } from "comps/icons/logo"
import { WalletIcon } from "comps/icons/wallet"
import { useWalletDialog } from "comps/wallet/context"
import { BigNumber } from "ethers"
import { tryFormat, tryParse } from "libs/ethers/bignumber"
import { useInputChange } from "libs/react/events"
import { OptionalHandle } from "libs/react/handles/handle"
import { StringHandle } from "libs/react/handles/string"
import { useCallback, useEffect } from "react"

export function Input(props: {
	input: StringHandle
	amount: OptionalHandle<BigNumber>
	maximum: BigNumber | undefined
}) {
	const { input, amount, maximum } = props
	const dialog = useWalletDialog()
	const crypto = useCrypto()

	useEffect(() => {
		amount.set(tryParse(input.current))
	}, [input.current])

	const onAmountChange = useInputChange(e => {
		const value = e.currentTarget.value
			.replaceAll(/[^\d.,]/g, "")
			.replaceAll(",", ".")
		input.set(value)
	}, [])

	const max = useCallback(() => {
		input.set(tryFormat(maximum))
		amount.set(maximum)
	}, [maximum])

	return <div className="p-md bg-contrast w-full rounded-xl border-2 border-transparent ahover:border-contrast font-comfortaa flex items-center gap-4">
		<LogoIcon className="icon-2xl text-colored animate-header" />
		<input className="w-full flex flex-center text-2xl bg-transparent font-default"
			value={input.current} onChange={onAmountChange}
			pattern="^[0-9]*[.,]?[0-9]*$" inputMode="decimal"
			placeholder="0.0">
		</input>
		{crypto ? <>
			<button className="flex flex-center p-md text-colored shadow-sm text-center rounded-xl bg-transcolored ahover:bg-transcolored2 transition-colors"
				onClick={max}>
				<span className="text-sm font-comfortaa pt-[2px]">Max</span>
			</button>
		</> : <>
			<button className="p-md flex flex-center shadow-sm rounded-xl bg-transcolored ahover:bg-transcolored2 transition-colors"
				onClick={dialog.enable}>
				<WalletIcon className="icon-sm text-center text-colored" />
			</button>
		</>}
	</div>
}