import Document, { Head, Html, Main, NextScript } from "next/document"

/**
 * This will be run before React so we must minify it
 * Unminified code is in /raw/themer.js
 */
const themer = `const matcher=matchMedia("(prefers-color-scheme: dark)"),color=document.querySelector("meta[name=theme-color]");function setTheme(e){(e?"dark"===e:matcher.matches)?(document.documentElement.classList.add("dark"),color.setAttribute("content","#000000")):(document.documentElement.classList.remove("dark"),color.setAttribute("content","#ffffff"))}function loadTheme(){const e=localStorage.getItem("theme");setTheme(e?JSON.parse(e):void 0)}loadTheme();`

/**
 * Can be changed
 */
const fonts = `https://fonts.googleapis.com/css2??family=Manrope:wght@200;300;400;500;600;700;800&family=Comfortaa&family=Montserrat:wght@300;400;500;600;700&display=block`
export default class MyDocument extends Document {
	render() {
		return <Html lang="fr">
			<Head>
				<meta name="theme-color" content="#2dd4bf" />
				<script dangerouslySetInnerHTML={{ __html: themer }} />
				<link rel="stylesheet" type="text/css" href={fonts} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	}
}