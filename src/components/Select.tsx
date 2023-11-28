import * as SelectR from '@radix-ui/react-select'
import { CaretDown } from 'phosphor-react'
import { Spinner } from './Spinner'
interface SelectProps extends SelectR.SelectProps {
  values: {
    id: string
    name: string
  }[]
  placeholder: string
  hasIcon?: boolean
  isLoading?: boolean
}

export function Select({
  values,
  placeholder,
  disabled,
  hasIcon = true,
  isLoading = false,
  ...props
}: SelectProps) {
  if (isLoading) {
    return (
      <div className="flex w-full cursor-not-allowed items-center justify-between rounded-md bg-gray-900 px-4 py-3 text-sm leading-6 text-neutral-600 ">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <SelectR.Root disabled={disabled} {...props}>
      <SelectR.Trigger className="flex w-full items-center justify-between rounded-md bg-gray-900 px-4 py-3 text-sm leading-6 text-white disabled:cursor-not-allowed disabled:text-neutral-600 ">
        <SelectR.Value placeholder={placeholder} />
        <SelectR.Icon
          className={`text-white ${disabled || !hasIcon ? 'hidden' : 'flex'}`}
          asChild
        >
          <CaretDown size={24} />
        </SelectR.Icon>
      </SelectR.Trigger>

      <SelectR.Portal>
        <SelectR.Content>
          {/* <Select.ScrollUpButton /> */}
          <SelectR.Viewport className="flex flex-col gap-4 rounded-md bg-gray-900 p-5">
            {values.map((value) => (
              <SelectR.Item
                className="cursor-pointer text-sm text-white disabled:text-neutral-600  "
                key={value.id}
                value={value.id}
              >
                <SelectR.ItemText>{value.name}</SelectR.ItemText>
              </SelectR.Item>
            ))}
          </SelectR.Viewport>
        </SelectR.Content>
      </SelectR.Portal>
    </SelectR.Root>
  )
}
