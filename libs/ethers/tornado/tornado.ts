import { Contract } from "ethers";
import _Governance from "./abis/governance";
import _Staking from "./abis/staking";
import _TORN from "./abis/torn";

export namespace Tornado {
	export const TORN = new Contract("0x77777FeDdddFfC19Ff86DB637967013e6C6A116C", _TORN)
	export const Governance = new Contract("0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce", _Governance)
	export const Staking = new Contract("0x2FC93484614a34f26F7970CBB94615bA109BB4bf", _Staking)
}

