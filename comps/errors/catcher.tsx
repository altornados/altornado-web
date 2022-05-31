import { Component, ReactNode } from "react"

export type Fallback =
  (props: { error: unknown }) => JSX.Element

export interface CatcherProps {
  children: ReactNode
  fallback: Fallback
}

export class Catcher extends Component<CatcherProps, {
  error?: unknown
}> {
  constructor(props: CatcherProps) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(error, errorInfo)
  }

  render() {
    const { error } = this.state

    if (error)
      return <this.props.fallback error={error} />
    return this.props.children
  }
}