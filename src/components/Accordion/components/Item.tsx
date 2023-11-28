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
      <Accordion.Trigger className="flex w-full items-center justify-between p-3 font-roboto font-bold text-slate-200">
        {title}
        <CaretDown
          className={`origin-center transition-all ${
            isOpen && 'rotate-180'
          } duration-300`}
          size={24}
        />
      </Accordion.Trigger>
      <Accordion.Content
        className={`w-full overflow-hidden bg-amber-300 data-[state=closed]:animate-closeAccordion data-[state=open]:animate-openAccordion `}
      >
        {children}
      </Accordion.Content>
    </Accordion.Item>
  )
}
