import { useQuery } from '@tanstack/react-query'
import { ImportExcel } from './components/ImportExcel'
import { teamsGetAll } from '@/services/api/requests/get'
import { TeamCard } from '@/components/TeamCard'
import { FastAccessCard } from './components/FastAccessCard'

export default function AdminPage() {
  const { data: teams } = useQuery(['AllTeams'], async () => {
    const teams = await teamsGetAll()

    return teams
  })

  return (
    <main className="py-10">
      <div className="flex flex-col gap-10">
        <h2 className="text-gray-100 font-bold text-3xl">
          Menu de acesso rápido
        </h2>
        <div className="grid grid-cols-4 gap-5">
          <FastAccessCard>Importar cronôgrama</FastAccessCard>
          {/* {teams?.map((team) => (
            <TeamCard
              key={team.id}
              teamName={team.teamName}
              courseName={team.courseName}
            />
          ))} */}
        </div>
      </div>
    </main>
  )
}
