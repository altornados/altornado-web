import { useTheme } from "comps/theme/context"

export function LayoutFooter() {
	const theme = useTheme()

	const github = theme.current === "dark"
		? "/assets/githubwhite.svg"
		: "/assets/github.svg"

	return <footer className="p-lg max-w-[1000px] m-auto">
		<a className="p-2 bg-card text-opposite rounded-full flex items-center gap-2 shadow-sm"
			href="https://github.com/altornados/altornado-web"
			target="_blank" rel="noreferrer">
			<img width={32} height={32}
				src={github} alt="github" />
			<div className="px-2 font-montserrat">
				We are open source
			</div>
		</a>
	</footer>
}