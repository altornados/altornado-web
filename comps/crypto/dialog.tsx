import { useCrypto } from "comps/crypto/context"
import { WalletIcon } from "comps/icons/wallet"
import { Jazzicon } from "comps/jazzicon/jazzicon"
import { Dialog } from "comps/modals/dialog"
import { useAsyncTry } from "libs/react/async"
import { CloseProps } from "libs/react/props"
import { useState } from "react"
import { useError } from "../dialogs/error"

export function WalletInfo(props: CloseProps & {
	address: string
}) {
	const { close, address } = props
	const crypto = useCrypto()
	const error = useError()

	const [copied, setCopied] = useState(false)

	const onCopyClick = useAsyncTry(async () => {
		await navigator.clipboard.writeText(props.address)
		setCopied(true)
		setTimeout(() => setCopied(false), 600)
	}, [copied], error.set)

	return <Dialog className="max-w-[499px]" close={close}>
		<div className="font-montserrat">
			<h1 className="text-xl font-medium">
				Your wallet
			</h1>
			<div className="my-2" />
			<div className="rounded-xl bg-card">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<WalletIcon className="icon-xs text-colored" />
						{crypto?.provider.connection.url === "metamask"
							? <span className="">Metamask</span>
							: <span className="">WalletConnect</span>}
					</div>
					<button className="anchor text-colored"
						onClick={crypto?.disconnect}>Disconnect</button>
				</div>
				<div className="my-3" />
				<div className="flex items-center gap-2">
					<Jazzicon size={20}
						address={address} />
					<div className="font-medium text-lg">
						{`${address.slice(0, 10)}...${address.slice(-6)}`}
					</div>
				</div>
				<div className="my-3" />
				<div className="flex flex-wrap items-center justify-between gap-2">
					{!copied ? <>
						<button className="flex items-center gap-2"
							onClick={onCopyClick.run}>
							<img className="icon-xs"
								src="/assets/copy.svg" />
							<span className="">
								Copy address
							</span>
						</button>
					</> : <>
						<button className="flex items-center gap-2">
							<img className="icon-xs"
								src="/assets/checkmark.svg" />
							<span className="w-24 text-left">
								Copied
							</span>
						</button>
					</>}
					<a className="flex items-center gap-2"
						href={`https://etherscan.io/address/${address}`}
						target="_blank" rel="noreferrer">
						<img className="icon-xs"
							src="/assets/externallink.svg" />
						<div>
							<span>
								{`View on `}
							</span>
							<span className="text-colored anchor">
								Explorer
							</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	</Dialog>
}
