import { Spinner } from '@/components/Spinner'
import { Check, PencilSimpleLine } from 'phosphor-react'

interface FormActionIconProps {
  inputValue: string
  isLoading: boolean
}

export function FormActionIcon({ inputValue, isLoading }: FormActionIconProps) {
  if (!inputValue) {
    return <PencilSimpleLine className="text-white" size={24} />
  }

  if (isLoading) {
    return <Spinner size={24} />
  }

  return <Check className="text-white" size={24} />
}
