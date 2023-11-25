import { Select } from '@/components/Select'
import { FormActionIcon } from './FormActionIcon'
import { Dispatch, SetStateAction } from 'react'
import { Team, User } from '@prisma/client'
import { EditableOptionsProps } from '../index.page'

interface FormInputCoursesProps {
  isLoading: boolean
  userTeam: Team | null
  editableOptions: EditableOptionsProps
  teams: Team[] | undefined
  user: User
  setEditableOptions: Dispatch<SetStateAction<EditableOptionsProps>>
  setUserTeam: Dispatch<SetStateAction<Team | null>>
  handleUpdateUser: (
    infoToUpdate: keyof EditableOptionsProps,
    editableOptions: EditableOptionsProps,
  ) => Promise<void>
}

export function FormInputTeam({
  isLoading,
  teams,
  userTeam,
  editableOptions,
  user,
  handleUpdateUser,
  setEditableOptions,
  setUserTeam,
}: FormInputCoursesProps) {
  const defaultValueToSelect =
    userTeam?.courseId ===
      (editableOptions.courseId
        ? editableOptions.courseId
        : userTeam?.courseId) && !editableOptions.teamId
      ? userTeam?.id
      : teams?.find((team) => team.id === editableOptions.teamId)?.id ||
        undefined

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-gray-100 font-bold text-xs" htmlFor="team">
        Turma
      </label>
      <Select
        name="team"
        hasIcon={false}
        isLoading={isLoading}
        disabled={!editableOptions.teamId}
        placeholder="Selecione uma turma"
        onValueChange={(value) => {
          setEditableOptions(({ teamId, ...state }) => {
            return {
              ...state,
              teamId: value,
            }
          })
        }}
        defaultValue={defaultValueToSelect}
        values={
          teams?.map((team) => {
            return {
              id: team.id,
              name: team.teamName,
            }
          }) ?? []
        }
      />

      <button
        onClick={() => {
          if (!editableOptions.teamId) {
            setEditableOptions(({ teamId, ...state }) => {
              return {
                ...state,
                teamId: user.teamId ?? '',
              }
            })
          }
          if (
            !!editableOptions.teamId &&
            editableOptions.teamId !== user.teamId
          ) {
            const searchedTeam = teams?.find(
              (team) => team.id === editableOptions.teamId,
            )
            setUserTeam(() => {
              if (searchedTeam) {
                return searchedTeam
              }
              return userTeam
            })

            handleUpdateUser('teamId', editableOptions)
          }

          if (
            !!editableOptions.teamId &&
            editableOptions.teamId === user.teamId
          ) {
            setEditableOptions(({ teamId, ...state }) => {
              return {
                ...state,
                teamId: '',
              }
            })
          }
        }}
        className="absolute bottom-0 right-0 px-4 py-3"
      >
        <FormActionIcon
          inputValue={editableOptions.teamId}
          isLoading={isLoading}
        />
      </button>
    </div>
  )
}
