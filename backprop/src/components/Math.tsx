import { useEffect, useRef } from 'react'
import katex from 'katex'

interface KatexMathProps {
  children: string
  block?: boolean
}

export default function KatexMath({ children, block = false }: KatexMathProps) {
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        throwOnError: false,
        displayMode: block,
      })
    }
  }, [children, block])
  
  if (block) {
    return (
      <div className="math-block">
        <span ref={ref} />
      </div>
    )
  }
  
  return <span ref={ref} className="math-inline" />
}

