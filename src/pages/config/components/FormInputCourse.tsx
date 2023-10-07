import { Select } from '@/components/Select'
import { FormActionIcon } from './FormActionIcon'
import { Dispatch, SetStateAction, useState } from 'react'
import { Course, Team } from '@prisma/client'
import { EditableOptionsProps } from '../index.page'

interface FormInputCoursesProps {
  isLoading: boolean
  courses: Course[]
  userTeam: Team
  editableOptions: EditableOptionsProps
  setEditableOptions: Dispatch<SetStateAction<EditableOptionsProps>>
}

export function FormInputCourse({
  isLoading,
  courses,
  userTeam,
  editableOptions,
  setEditableOptions,
}: FormInputCoursesProps) {
  const [refetchCourses, setRefetchCourses] = useState(false)

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-gray-100 font-bold text-xs" htmlFor="course">
        Curso
      </label>
      <Select
        hasIcon={false}
        isLoading={refetchCourses}
        name="course"
        disabled={!editableOptions.courseId}
        placeholder="Selecione um curso"
        onValueChange={(value) => {
          setEditableOptions(({ courseId, ...state }) => {
            return {
              ...state,
              courseId: value,
            }
          })
        }}
        defaultValue={userTeam.courseId}
        values={courses.map((course) => {
          return {
            id: course.id,
            name: course.courseName,
          }
        })}
      />
      <button
        onClick={() => {
          if (!editableOptions.courseId) {
            setEditableOptions(({ courseId, ...state }) => {
              return {
                ...state,
                courseId: userTeam.courseId ?? '',
              }
            })
          }

          if (
            !!editableOptions.courseId &&
            editableOptions.courseId === userTeam.courseId
          ) {
            setEditableOptions(({ courseId, ...state }) => {
              return {
                ...state,
                courseId: '',
              }
            })
          }

          if (
            !!editableOptions.courseId &&
            editableOptions.courseId !== userTeam.courseId &&
            (!editableOptions.teamId ||
              editableOptions.teamId === userTeam.id ||
              editableOptions.teamId !== userTeam.id)
          ) {
            setRefetchCourses(true)
            setTimeout(() => {
              setRefetchCourses(false)
            }, 1)
            setEditableOptions(({ courseId, teamId, ...state }) => {
              return {
                ...state,
                courseId: '',
                teamId: '',
              }
            })
          }
        }}
        className="absolute bottom-0 right-0 px-4 py-3"
      >
        <FormActionIcon
          inputValue={editableOptions.courseId}
          isLoading={isLoading}
        />
      </button>
    </div>
  )
}
