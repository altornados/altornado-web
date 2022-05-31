import { useCrypto } from "comps/crypto/context"
import { BigNumber } from "ethers"
import { Tornado } from "libs/ethers/tornado/tornado"
import { api } from "libs/fetch/api"
import { datafetch } from "libs/fetch/fetch"
import { FetchHandle, useFetch } from "libs/fetch/react"
import { useObjectMemo } from "libs/react/memo"
import { ChildrenProps } from "libs/react/props"
import { createContext, useCallback, useContext, useEffect } from "react"

export interface DataHandle {
	balance: FetchHandle<BigNumber | undefined>
	lockeds: FetchHandle<BigNumber | undefined>
	rewards: FetchHandle<BigNumber | undefined>
	// apr7: FetchHandle<number | undefined>
	// apr30: FetchHandle<number | undefined>
	apr365: FetchHandle<number | undefined>
}

export const DataContext =
	createContext<DataHandle | undefined>(undefined)

export function useData() {
	return useContext(DataContext)!
}

/***
 * @inside CryptoProvider
 */
export function DataProvider(props: ChildrenProps) {
	const crypto = useCrypto()

	// const apr7 = useFetch<number>(async () => {
	// 	return await datafetch(api("/graph/apr?days=7"))
	// }, [])

	// const apr30 = useFetch<number>(async () => {
	// 	return await datafetch(api("/graph/apr?days=30"))
	// }, [])

	const apr365 = useFetch<number>(async () => {
		return await datafetch(api("/graph/apr?days=365"))
	}, [])

	const balance = useFetch<BigNumber | undefined>(async () => {
		if (!crypto) return
		return await Tornado.TORN
			.connect(crypto.signer)
			.balanceOf(crypto.address)
	}, [crypto])

	const lockeds = useFetch<BigNumber | undefined>(async () => {
		if (!crypto) return
		return await Tornado.Governance
			.connect(crypto.signer)
			.lockedBalance(crypto.address) as BigNumber
	}, [crypto])

	const rewards = useFetch<BigNumber | undefined>(async () => {
		if (!crypto) return
		return await Tornado.Staking
			.connect(crypto.signer)
			.checkReward(crypto.address) as BigNumber
	}, [crypto])

	const fetchBalanceAndLockeds = useCallback(() => {
		balance.fetch()
		lockeds.fetch()
	}, [balance.fetch, lockeds.fetch])

	useEffect(() => {
		if (!crypto) return

		const torn = Tornado.TORN.connect(crypto.signer)

		const outgoing = torn.filters.Transfer(crypto.address)
		const incoming = torn.filters.Transfer(null, crypto.address)

		torn.on(outgoing, fetchBalanceAndLockeds)
		torn.on(incoming, fetchBalanceAndLockeds)

		return () => {
			torn.off(outgoing, fetchBalanceAndLockeds)
			torn.off(incoming, fetchBalanceAndLockeds)
		}
	}, [crypto, fetchBalanceAndLockeds])

	useEffect(() => {
		if (!crypto) return

		const staking = Tornado.Staking.connect(crypto.signer)

		const updated = staking.filters.RewardsUpdated(crypto.address)
		const claimed = staking.filters.RewardsClaimed(crypto.address)

		staking.on(updated, rewards.fetch)
		staking.on(claimed, rewards.fetch)

		return () => {
			staking.off(updated, rewards.fetch)
			staking.off(claimed, rewards.fetch)
		}
	}, [crypto, rewards.fetch])

	const handle = useObjectMemo({ balance, lockeds, rewards, apr365 })

	return <DataContext.Provider value={handle}>
		{props.children}
	</DataContext.Provider>
}
