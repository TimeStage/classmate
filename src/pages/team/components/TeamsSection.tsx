import { Button } from '@/components/Button'
import { GetAllTeamsResponse } from '@/models/team'
import { CircleNotch, MagnifyingGlass, SmileySad } from 'phosphor-react'

interface TeamsSectionProps {
  isFetching?: boolean
  teams: GetAllTeamsResponse[]
  handleChangeFilter: (filter: string) => void
}

export function TeamsSection({
  isFetching,
  teams,
  handleChangeFilter,
}: TeamsSectionProps) {
  if (isFetching) {
    return <CircleNotch className="animate-spin text-gray-100" size={50} />
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col gap-7 w-full justify-center items-center">
        <SmileySad className="text-stone-400" size={192} />
        <Button
          onClick={() => handleChangeFilter('')}
          className="bg-amber-500 "
        >
          Ver todas as turmas <MagnifyingGlass size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {teams.map((team) => (
        <div
          className="flex justify-between items-center bg-amber-500 py-4 px-10 rounded-md text-gray-100 "
          key={team.id}
        >
          <h1 className="text-2xl font-bold">{team.teamName}</h1>
          <span className="text-xl">{team.courseName}</span>
        </div>
      ))}
    </div>
  )
}
