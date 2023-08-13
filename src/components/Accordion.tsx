import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export const AccordionDemo = () => (
  <Accordion.Root
    className="bg-mauve6 w-[300px] rounded-md shadow-[0_2px_10px] shadow-black/5"
    type="single"
    defaultValue="item-1"
    collapsible
  >
    <AccordionItem value="item-1">
      <AccordionTrigger>Segunda-Feira</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-2">
      <AccordionTrigger>Terça-Feira</AccordionTrigger>
      <AccordionContent>
        Yes. It's unstyled by default, giving you freedom over the look and
        feel.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-3">
      <AccordionTrigger>Quarta-Feira</AccordionTrigger>
      <AccordionContent>
        Yes! You can animate the Accordion with CSS or JavaScript.
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="item-4">
      <AccordionTrigger>Quinta-Feira</AccordionTrigger>
      <AccordionContent>
        Yes! You can animate the Accordion with CSS or JavaScript.
      </AccordionContent>

      <AccordionItem value="item-5">
        <AccordionTrigger>Sexta-Feira</AccordionTrigger>
        <AccordionContent>
          Yes! You can animate the Accordion with CSS or JavaScript.
        </AccordionContent>
      </AccordionItem>
    </AccordionItem>
  </Accordion.Root>
)

const AccordionItem = ({ children, className, ...props }) => (
  <Accordion.Item
    className={`focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] ${className}`}
    {...props}
  >
    {children}
  </Accordion.Item>
)

const AccordionTrigger = ({ children, className, ...props }) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={`text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none ${className}`}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
)

const AccordionContent = ({ children, className, ...props }) => (
  <Accordion.Content
    className={`text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px] ${className}`}
    {...props}
  >
    <div className="py-[15px] px-5">{children}</div>
  </Accordion.Content>
)
