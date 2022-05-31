import { getAddress } from "ethers/lib/utils"
import { useMemo } from "react"

export function useAddress(address?: string) {
	return useMemo(() => {
		if (address) return tryAddressOr(address, undefined)
	}, [address])
}

export function tryAddressOr<T>(address: string, or: T) {
	try {
		return getAddress(address)
	} catch (e: unknown) {
		return or
	}
}

export function tryAddressOrThrow(address: string, Error: new () => Error) {
	try {
		return getAddress(address)
	} catch (e: unknown) {
		throw new Error()
	}
}