const matcher = matchMedia("(prefers-color-scheme: dark)")
const color = document.querySelector("meta[name=theme-color]")

function setTheme(stored) {
	const dark = stored
		? stored === "dark"
		: matcher.matches

	if (dark) {
		document.documentElement.classList.add("dark")
		color.setAttribute("content", "#000000")
	} else {
		document.documentElement.classList.remove("dark")
		color.setAttribute("content", "#ffffff")
	}
}

function loadTheme() {
	const value = localStorage.getItem("theme")
	setTheme(value ? JSON.parse(value) : undefined)
}

loadTheme()