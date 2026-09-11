import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type QuantityStepperProps = {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

export function QuantityStepper({ value, min = 1, max = 99, onChange, className }: QuantityStepperProps) {
  const effectiveMax = Math.max(min, max)
  const clampedValue = Math.min(Math.max(value, min), effectiveMax)

  return (
    <div className={cn('inline-flex items-center rounded-md border bg-card', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10"
        onClick={() => onChange(Math.max(min, clampedValue - 1))}
        disabled={clampedValue <= min || effectiveMax < min}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
        {clampedValue}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10"
        onClick={() => onChange(Math.min(effectiveMax, clampedValue + 1))}
        disabled={clampedValue >= effectiveMax || effectiveMax < min}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  )
}
