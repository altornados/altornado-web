import { CryptoProvider } from "comps/crypto/context"
import { DataProvider } from "comps/data/context"
import { ErrorProvider } from "comps/dialogs/error"
import { Catcher } from "comps/errors/catcher"
import { ErrorPage } from "comps/errors/page"
import { LayoutCard } from "comps/layout/card"
import { LayoutFooter } from "comps/layout/footer"
import { LayoutHeader } from "comps/layout/header"
import { LayoutNavbar } from "comps/layout/navbar"
import { ReadyProvider } from "comps/next/ready"
import { ThemeProvider } from "comps/theme/context"
import { WalletDialogProvider } from "comps/wallet/context"
import { ChildrenProps } from "libs/react/props"
import type { AppProps } from "next/app"
import Head from "next/head"
import "../styles/globals.css"

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	return <Catcher fallback={ErrorPage}>
		<Providers>
			<Wrapper>
				<Component {...pageProps} />
			</Wrapper>
		</Providers>
	</Catcher>
}

function Providers(props: ChildrenProps) {
	const { children } = props

	return <ReadyProvider>
		<ThemeProvider>
			<ErrorProvider>
				<WalletDialogProvider>
					<CryptoProvider>
						<DataProvider>
							{children}
						</DataProvider>
					</CryptoProvider>
				</WalletDialogProvider>
			</ErrorProvider>
		</ThemeProvider>
	</ReadyProvider>
}

function Wrapper(props: ChildrenProps) {
	const { children } = props

	return <>
		<Head>
			<title>altornado</title>
			<meta name="application-name" content="Altornado" />
			<meta name="description" content="Alternative Tornado Cash" />
			<meta name="color-scheme" content="dark light" />
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="white" />
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<link rel="alternate icon" href="/favicon.ico" />
		</Head>
		<div className="fixed inset-0 -z-10 bg-filter dark:bg-filter-dark" />
		<div className="min-h-[90%] flex flex-col items-stretch">
			<LayoutHeader />
			<div className="my-1" />
			<LayoutNavbar />
			<div className="my-1" />
			<LayoutCard>
				{children}
			</LayoutCard>
			<div className="my-1 grow" />
			<LayoutFooter />
		</div>
	</>
}


