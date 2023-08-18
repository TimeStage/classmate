import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={` p-3 flex gap-2 text-white disabled:opacity-70 disabled:cursor-not-allowed justify-center items-center rounded-md font-medium text-sm w-full transition-all hover:opacity-70 ${className}`}
    >
      {children}
    </button>
  )
}
