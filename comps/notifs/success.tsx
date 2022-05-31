import { OutlineCheckIcon } from "comps/icons/heroicons"
import { Notif } from "comps/modals/notif"
import { CloseProps } from "libs/react/props"

export function SuccessNotif(props: CloseProps & {
	txHash: string
}) {
	const { close, txHash } = props

	return <Notif close={close}>
		<div className="flex items-center gap-2">
			<OutlineCheckIcon className="icon-md" />
			<span className="font-montserrat">
				Transaction succeed 🚀
			</span>
		</div>
		<a className="block text-colored text-base anchor text-center"
			href={`https://etherscan.io/tx/${txHash}`}
			target="_blank" rel="noreferrer">
			View on Etherscan
		</a>
	</Notif>
}
