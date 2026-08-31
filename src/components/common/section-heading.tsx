import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow ? <p className="text-caption mb-3">{eyebrow}</p> : null}
      <h2 className="text-section">{title}</h2>
      {description ? <p className="mt-3 max-w-xl text-small">{description}</p> : null}
    </div>
  )
}
