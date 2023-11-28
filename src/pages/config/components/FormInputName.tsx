import { FormActionIcon } from './FormActionIcon'
import { Dispatch, SetStateAction } from 'react'
import { User } from '@prisma/client'
import { EditableOptionsProps } from '../index.page'

interface FormInputCoursesProps {
  isLoading: boolean
  user: User
  editableOptions: EditableOptionsProps
  setEditableOptions: Dispatch<SetStateAction<EditableOptionsProps>>
  handleUpdateUser: (
    infoToUpdate: keyof EditableOptionsProps,
    editableOptions: EditableOptionsProps,
  ) => Promise<void>
}

export function FormInputName({
  isLoading,
  editableOptions,
  user,
  setEditableOptions,
  handleUpdateUser,
}: FormInputCoursesProps) {
  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-100" htmlFor="name">
        Nome
      </label>
      <input
        disabled={!editableOptions.name}
        className="rounded-md bg-gray-900 px-4 py-3 leading-6 text-gray-100 placeholder:text-sm disabled:cursor-not-allowed disabled:text-neutral-600"
        type="text"
        id="name"
        onChange={(event) => {
          setEditableOptions(({ name, ...state }) => {
            return {
              ...state,
              name: event.target.value !== '' ? event.target.value : ' ',
            }
          })
        }}
        defaultValue={user.name ?? 'Insira seu nome!'}
      />
      <button
        onClick={() => {
          if (!editableOptions.name) {
            setEditableOptions(({ name, ...state }) => {
              return {
                ...state,
                name: user.name ?? '',
              }
            })
          }
          if (!!editableOptions.name && editableOptions.name !== user.name) {
            handleUpdateUser('name', editableOptions)
          }
          if (!!editableOptions.name && editableOptions.name === user.name) {
            setEditableOptions(({ name, ...state }) => {
              return {
                ...state,
                name: '',
              }
            })
          }
        }}
        className="absolute bottom-0 right-0 px-4 py-3"
      >
        <FormActionIcon
          inputValue={editableOptions.name}
          isLoading={isLoading}
        />
      </button>
    </div>
  )
}
