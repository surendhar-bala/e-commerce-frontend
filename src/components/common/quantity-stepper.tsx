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
  return (
    <div className={cn('inline-flex items-center rounded-md border bg-card', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  )
}
