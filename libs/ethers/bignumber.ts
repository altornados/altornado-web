import { BigNumber, FixedNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useMemo } from "react";

export function tryParse(x?: string) {
	try {
		if (x) return parseUnits(x)
	} catch (e: unknown) { }
}

export function useParse(x?: string) {
	return useMemo(() => tryParse(x), [x])
}

export function tryFormat(x?: BigNumber) {
	try {
		if (x) return formatUnits(x)
	} catch (e: unknown) { }
}

export function useFormat(x?: BigNumber) {
	return useMemo(() => tryFormat(x), [x])
}

export function tryFloat(x?: BigNumber) {
	try {
		if (!x) return
		return FixedNumber
			.fromValue(x, 18)
			.round(3)
			.toUnsafeFloat()
	} catch (e: unknown) { }
}

export function useFloat(x?: BigNumber) {
	return useMemo(() => {
		if (x) return tryFloat(x)
	}, [x])
}