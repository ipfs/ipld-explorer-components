import { type CID } from 'multiformats/cid'
import React, { type HTMLProps } from 'react'

export function cidStartAndEnd (value: any): { value: any, start: string, end: string } {
  const chars = value.split('')
  if (chars.length <= 9) return value
  const start = chars.slice(0, 4).join('')
  const end = chars.slice(chars.length - 4).join('')
  return {
    value,
    start,
    end
  }
}

export function shortCid (value: any): string {
  const { start, end } = cidStartAndEnd(value)
  return `${start}…${end}`
}

export interface CidProps extends Omit<HTMLProps<JSX.IntrinsicElements['abbr']>, 'value'> {
  value: CID
}

const Cid: React.FC<CidProps> = ({ value, title, style, ...props }) => {
  style = Object.assign({}, {
    textDecoration: 'none'
  }, style)
  const { start, end } = cidStartAndEnd(value)
  return (
    // @ts-expect-error - todo: resolve this type error
    <abbr title={title ?? value} style={style} {...props}>
      <span>{start}</span>
      <span className='o-20'>…</span>
      <span>{end}</span>
    </abbr>
  )
}

export default Cid
