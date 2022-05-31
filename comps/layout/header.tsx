import { CryptoProps, useCrypto } from "comps/crypto/context"
import { WalletInfo } from "comps/crypto/dialog"
import { SolidDesktopComputerIcon, SolidMoonIcon, SolidSunIcon } from "comps/icons/heroicons"
import { LogoIcon } from "comps/icons/logo"
import { WalletIcon } from "comps/icons/wallet"
import { Jazzicon } from "comps/jazzicon/jazzicon"
import { Modal } from "comps/modals/modal"
import { Anchor } from "comps/next/anchor"
import { useTheme } from "comps/theme/context"
import { useWalletDialog } from "comps/wallet/context"
import { popperOptions } from "libs/popper/popper"
import { useBoolean } from "libs/react/handles/boolean"
import { useElement } from "libs/react/handles/element"
import { useCallback, useMemo } from "react"
import { usePopper } from "react-popper"

export function LayoutHeader() {
	const crypto = useCrypto()

	return <header className="p-4 w-full max-w-[1000px] m-auto flex items-center flex-wrap gap-2">
		<Anchor className="flex items-center justify-center"
			href="/">
			<div className="w-full rounded-full animate-header">
				<LogoIcon className="icon-lg text-colored" />
			</div>
			<div className="mx-[5px]" />
			<h1 className="font-comfortaa text-3xl">
				altornado
			</h1>
			<sup className="text-xs scale-90">
				1.0
			</sup>
			<p className="hidden sm:block absolute text-xs font-comfortaa pt-11 pl-[49px]">
				by Tornado Cash Community
			</p>
		</Anchor>
		<div className="grow" />
		<div className="flex items-center gap-2">
			<ThemeButton />
			{crypto
				? <WalletButton crypto={crypto} />
				: <ConnectButton />}
		</div>
	</header>
}

function ThemeButton() {
	const theme = useTheme()

	const reference = useElement<HTMLElement>()
	const element = useElement<HTMLElement>()

	const popper = usePopper(
		reference.current,
		element.current,
		popperOptions)

	const onAutoClick = useCallback(() => {
		theme.set(undefined)
		reference.unset()
	}, [])

	const onLightClick = useCallback(() => {
		theme.set("light")
		reference.unset()
	}, [])

	const onDarkClick = useCallback(() => {
		theme.set("dark")
		reference.unset()
	}, [])

	const text = useMemo(() => {
		if (theme.stored === undefined)
			return "Auto"
		if (theme.stored === "light")
			return "Light"
		if (theme.stored === "dark")
			return "Dark"
	}, [theme.stored])

	return <>
		{reference.current && <Modal>
			<div className="fixed z-10 inset-0 bg-backdrop"
				onClick={reference.unset} />
			<div className="z-10 p-1 bg-card text-opposite rounded-xl flex flex-col gap-1"
				ref={element.set}
				style={popper.styles.popper}
				{...popper.attributes.popper}>
				<button className="flex items-center gap-6 p-md ahover:bg-contrast rounded-xl"
					onClick={onAutoClick}>
					<SolidDesktopComputerIcon className="icon-sm" />
					<span className="">Auto</span>
				</button>
				<button className="flex items-center gap-6 p-md ahover:bg-contrast rounded-xl"
					onClick={onDarkClick}>
					<SolidMoonIcon className="icon-sm" />
					<span className="">Dark</span>
				</button>
				<button className="flex items-center gap-6 p-md ahover:bg-contrast rounded-xl"
					onClick={onLightClick}>
					<SolidSunIcon className="icon-sm" />
					<span className="">Light</span>
				</button>
			</div>
		</Modal>}
		<button className="flex items-center font-montserrat gap-2 p-md rounded-full bg-card text-opposite ahover:text-colored"
			onClick={reference.use}>
			{theme.stored === "light"
				? <SolidSunIcon className="icon-xs sm:icon-sm md:icon-sm lg:icon-sm" /> :
				theme.stored === "dark" ?
					<SolidMoonIcon className="icon-xs sm:icon-sm md:icon-sm lg:icon-sm" /> :
					<SolidDesktopComputerIcon className="icon-xs sm:icon-sm md:icon-sm lg:icon-sm" />}
			<div className="hidden lg:block text-sm">
				{text}
			</div>
		</button>
	</>
}

function WalletButton(props: CryptoProps) {
	const { crypto } = props

	const dialog = useBoolean()

	return <>
		{dialog.current &&
			<WalletInfo
				close={dialog.disable}
				address={crypto.address} />}
		<button className="flex items-center gap-2 p-md rounded-full font-montserrat bg-card ahover:text-colored"
			onClick={dialog.enable}>
			<div className="hidden sm:block">
				<div className="flex justify-center items-center">
					<Jazzicon size={20}
						address={crypto.address} />
				</div>
			</div>
			<div className=" sm:hidden flex justify-center items-center">
				<Jazzicon size={16}
					address={crypto.address} />
			</div>
			<div className="hidden lg:block text-sm">
				{`${crypto.address.slice(0, 5)}...${crypto.address.slice(-5)}`}
			</div>
		</button>
	</>
}

function ConnectButton() {
	const dialog = useWalletDialog()

	return <button className="flex items-center gap-2 p-md rounded-full font-montserrat bg-card ahover:text-colored"
		onClick={dialog.enable}>
		<WalletIcon className="icon-xs sm:icon-sm md:icon-sm lg:icon-sm" />
		<div className="hidden lg:block text-sm">
			Connect
		</div>
	</button>
}