import { keep, useKeyboardEscape, useMouse } from "libs/react/events"
import { ChildrenProps, ClassProps, CloseProps } from "libs/react/props"
import { Modal } from "./modal"

export function Dialog(props: ChildrenProps & CloseProps & ClassProps) {
	const { children, close, className = "max-w-xl" } = props

	const onClose = useMouse<HTMLDivElement>(e => {
		if (e.clientX < e.currentTarget.clientWidth) close()
	}, [close])

	const onEscape = useKeyboardEscape(close)

	return <Modal>
		<div className="fixed inset-0 z-10 bg-backdrop animate-opacity">
			<div className="w-full h-full p-4 flex flex-col animate-opacity-scale overflow-y-auto"
				onMouseDown={onClose}
				onClick={keep}>
				<div className="h-[4rem] grow shrink-0" />
				<aside className={`m-auto w-full min-w-0 rounded-xl bg-card text-opposite ${className}`}
					onMouseDown={keep}
					onKeyDown={onEscape}>
					<div className="p-4">
						{children}
					</div>
				</aside>
				<div className="h-[4rem] grow shrink-0" />
			</div>
		</div>
	</Modal>
}