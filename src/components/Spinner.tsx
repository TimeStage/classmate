import { Spinner as SpinnerIcon } from 'phosphor-react'
import { ComponentProps } from 'react'

type SpinnerProps = ComponentProps<typeof SpinnerIcon>

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <SpinnerIcon
      {...props}
      className={`animate-spin text-white ${className}`}
    />
  )
}
