import { Dialog } from "comps/modals/dialog"
import { CloseProps } from "libs/react/props"

export function WalletDialog(props: CloseProps & {
	metamask(): void
	walletconnect(): void
}) {
	const { close, metamask, walletconnect } = props

	return <Dialog close={close}>
		<div className="">
			<h1 className="text-2xl text-center font-montserrat">
				Connect a wallet 🚀
			</h1>
			<div className="text-contrast font-montserrat font-light text-center">
				We will never have access to your accounts
			</div>
			<div className="my-4" />
			<div className="flex items-center flex-wrap gap-2">
				<button className="p-4 flex-1 rounded-xl border border-contrast ahover:border-opposite transition-colors disabled:opacity-50"
					onClick={metamask}
					disabled={!window.ethereum}>
					<div className="flex flex-col flex-center gap-2">
						<img
							width={48} height={48}
							src="/assets/metamask.svg" />
						<span>MetaMask</span>
					</div>
				</button>
				<button className="p-4 flex-1 rounded-xl border border-contrast ahover:border-opposite transition-colors"
					onClick={walletconnect}>
					<div className="flex flex-col flex-center gap-2">
						<img
							width={48} height={48}
							src="/assets/walletconnect.svg" />
						<span>WalletConnect</span>
					</div>
				</button>
			</div>
		</div>
	</Dialog>
}