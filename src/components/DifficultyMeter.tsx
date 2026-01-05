import React from 'react'

export function DifficultyMeter({ value, max = 10, size = 'sm', title }: {
  value?: number
  max?: number
  size?: 'sm' | 'md'
  title?: string
}) {
  const v = Math.max(0, Math.min(max, Number.isFinite(value as number) ? (value as number) : 0))
  const count = Math.max(1, max)
  const dotSize = size === 'md' ? 12 : 9
  const gap = size === 'md' ? 6 : 4

  // Color thresholds: <5 green, 6–8 orange, else red (incl. 5 and 9-10)
  let filledColor = '#22c55e' // green
  let glow = '0 0 6px rgba(34,197,94,0.55)'
  if (v >= 6 && v <= 8) {
    filledColor = '#f59e0b' // orange
    glow = '0 0 6px rgba(245,158,11,0.55)'
  } else if (v >= 5) {
    filledColor = '#ef4444' // red
    glow = '0 0 6px rgba(239,68,68,0.55)'
  }

  const emptyColor = 'rgba(255,255,255,0.18)'

  return (
    <div
      role="img"
      aria-label={title ? `${title}: ${v}/${count}` : `${v}/${count}`}
      title={title ? `${title}: ${v}/${count}` : `${v}/${count}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const filled = i < v
        return (
          <span
            key={i}
            aria-hidden
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: 999,
              background: filled ? filledColor : emptyColor,
              boxShadow: filled ? glow : 'none',
              transition: 'background .2s ease',
            }}
          />
        )
      })}
    </div>
  )
}

export default DifficultyMeter
