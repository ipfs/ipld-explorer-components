import React from 'react'
import ErrorIcon from '../../icons/GlyphSmallCancel'

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  state = {
    hasError: false
  }

  static defaultProps = {
    fallback: ErrorIcon
  }

  componentDidCatch (error: Error, info: React.ErrorInfo): void {
    this.setState({ hasError: true })
    console.error(error)
  }

  render (): JSX.Element {
    const { hasError } = this.state
    const { children, fallback: Fallback } = this.props
    return hasError ? <Fallback /> as React.ReactElement : children
  }
}

export default ErrorBoundary
