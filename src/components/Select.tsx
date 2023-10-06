import * as SelectR from '@radix-ui/react-select'
import { CaretDown } from 'phosphor-react'
interface SelectProps extends SelectR.SelectProps {
  values: {
    id: string
    name: string
  }[]
  placeholder: string
  hasIcon?: boolean
}

export function Select({
  values,
  placeholder,
  disabled,
  hasIcon = true,
  ...props
}: SelectProps) {
  return (
    <SelectR.Root disabled={disabled} {...props}>
      <SelectR.Trigger className="bg-gray-900 flex justify-between items-center rounded-md w-full leading-6 text-white disabled:cursor-not-allowed disabled:text-neutral-600 text-sm px-4 py-3 ">
        <SelectR.Value placeholder={placeholder} />
        {hasIcon && (
          <SelectR.Icon
            className={`text-white ${disabled ? 'hidden' : 'flex'}`}
            asChild
          >
            <CaretDown size={24} />
          </SelectR.Icon>
        )}
      </SelectR.Trigger>

      <SelectR.Portal>
        <SelectR.Content>
          {/* <Select.ScrollUpButton /> */}
          <SelectR.Viewport className="bg-gray-900 flex flex-col gap-4 p-5 rounded-md">
            {values.map((value) => (
              <SelectR.Item
                className="text-white disabled:text-neutral-600 cursor-pointer text-sm  "
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
