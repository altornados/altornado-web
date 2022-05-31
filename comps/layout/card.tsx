import { ChildrenProps } from "libs/react/props"
import { LayoutInfo } from "./info"

export function LayoutCard(props: ChildrenProps) {
	const { children } = props

	return <main className="p-md w-full max-w-[500px] m-auto">
		<div className="bg-transcolored rounded-2xl shadow-sm">
			<LayoutInfo />
			<div className="p-4 h-[300px] bg-card rounded-2xl flex flex-col items-stretch shadow-sm">
				{children}
			</div>
		</div>
	</main>
}