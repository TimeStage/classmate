import * as Accordion from '@radix-ui/react-accordion'
import { CaretDown } from 'phosphor-react'
import { ComponentProps, ReactNode } from 'react'

interface ItemProps extends ComponentProps<typeof Accordion.Item> {
  title: string
  value: string
  isOpen: boolean
  children: ReactNode
}

export function Item({
  children,
  title,
  value,
  isOpen,
  className,
  ...props
}: ItemProps) {
  return (
    <Accordion.Item
      {...props}
      className={`bg-amber-600 ${className}`}
      value={value}
    >
      <Accordion.Trigger className="text-slate-200 font-bold w-full p-3 font-roboto flex items-center justify-between">
        {title}
        <CaretDown
          className={`origin-center transition-all ${
            isOpen && 'rotate-180'
          } duration-300`}
          size={24}
        />
      </Accordion.Trigger>
      <Accordion.Content
        className={`bg-amber-300 w-full data-[state=open]:animate-openAccordion data-[state=closed]:animate-closeAccordion overflow-hidden `}
      >
        {children}
      </Accordion.Content>
    </Accordion.Item>
  )
}
