import React, { type CSSProperties, type PropsWithChildren } from 'react'
import ErrorBoundary from '../error/ErrorBoundary.js'

interface BoxProps {
  className?: string
  style?: CSSProperties
}

export const Box: React.FC<PropsWithChildren<BoxProps>> = ({
  className = 'pa4',
  style,
  children
}) => {
  return (
    <div className={className} style={{ background: 'var(--element-bg, #fbfbfb)', ...style }}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  )
}

export default Box
