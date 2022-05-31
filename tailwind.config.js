const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: "class",
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./comps/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		screens: {
			'xs': '475px',
			...defaultTheme.screens,
		},
	},
	plugins: [
		plugin(({ addVariant }) => {
			addVariant('ahover', ['&:active', '@media (hover: hover) { &:hover }'])
			addVariant('mhover', '@media (hover: hover) { &:hover }')
			addVariant('children', '& > *')
		})
	]
}
