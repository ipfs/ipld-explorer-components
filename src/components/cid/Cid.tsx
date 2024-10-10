import { type CID } from 'multiformats/cid'
import React, { type HTMLProps } from 'react'

export interface StringValue {
  value: string
  start: string
  end: string
}
export function cidStartAndEnd (value: string): StringValue {
  const chars = value.split('')
  if (chars.length <= 9) {
    return {
      value,
      start: value,
      end: ''
    }
  }
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

export interface CidProps extends Omit<HTMLProps<HTMLSpanElement>, 'value'> {
  value: CID
}

const Cid: React.FC<CidProps> = ({ value, title, style, ...props }) => {
  style = Object.assign({}, {
    textDecoration: 'none'
  }, style)
  const cidStr = value.toString()
  const { start, end } = cidStartAndEnd(cidStr)
  return (
    <abbr title={title ?? value.toString()} style={style} {...props}>
      <span>{start}</span>
      {start === cidStr ? null : <span className='o-20'>…</span>}
      <span>{end}</span>
    </abbr>
  )
}

export default Cid
