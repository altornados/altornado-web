import { ReactNode, Ref } from "react"

export type DivisionProps = JSX.IntrinsicElements["div"]
export type ButtonProps = JSX.IntrinsicElements["button"]
export type VectorProps = JSX.IntrinsicElements["svg"]
export type AnchorProps = JSX.IntrinsicElements["a"]

export interface ChildrenProps {
	children?: ReactNode
}

export interface ClassProps {
	className?: string
}

export interface PromiseProps<T> {
	ok(x: T): void
	err(e: Error): void
}

export interface CloseProps {
	close(): void
}

export interface RefProps<T> {
	xref?: Ref<T>
}