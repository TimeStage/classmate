import React, { ReactNode, useState } from 'react'
import * as AccordionR from '@radix-ui/react-accordion'
import { Item } from './components/Item'

interface AccordionProps {
  contents: {
    title: string
    value: string
    content: ReactNode
  }[]
}

export function Accordion({ contents }: AccordionProps) {
  const [oppenedOption, setOppenedOption] = useState('')

  return (
    <AccordionR.Root
      onValueChange={(value) => {
        setOppenedOption(value)
      }}
      className="w-full flex flex-col gap-[0.125rem]"
      type="single"
      defaultValue="item-1"
      collapsible
    >
      {contents.map((content, i) => {
        return (
          <Item
            isOpen={oppenedOption === content.value}
            className={
              i === 0
                ? 'rounded-t'
                : i === contents.length - 1
                ? 'rounded-b'
                : ''
            }
            value={content.value}
            key={content.value}
            title={content.title}
          >
            {content.content}
          </Item>
        )
      })}
    </AccordionR.Root>
  )
}
