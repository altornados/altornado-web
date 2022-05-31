import { OutlineXIcon } from "comps/icons/heroicons"
import { Modal } from "comps/modals/modal"
import { ChildrenProps, CloseProps } from "libs/react/props"

export function Notif(props: CloseProps & ChildrenProps) {
	const { close } = props

	return <Modal>
		<div className="fixed z-50 bottom-5 right-10 md:bottom-auto md:top-16 animate-opacity-scale">
			<div className="group relative p-md border-2 border-contrast bg-card text-opposite rounded-xl">
				{props.children}
				<div className="absolute sm:hidden sm:group-hover:block -top-2 -right-1">
					<button className="bg-opposite text-default rounded-full p-0.5"
						onClick={close}>
						<OutlineXIcon className="icon-xs" />
					</button>
				</div>
			</div>
		</div>
	</Modal>
}
