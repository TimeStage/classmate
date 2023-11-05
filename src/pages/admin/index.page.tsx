import { useQuery } from '@tanstack/react-query'
import { ImportExcel } from './import/components/ImportExcel'
import { teamsGetAll } from '@/services/api/requests/get'
import { FastAccessCard } from './components/FastAccessCard'
import { UploadSimple } from 'phosphor-react'

export default function AdminPage() {
  const { data: teams } = useQuery(['AllTeams'], async () => {
    const teams = await teamsGetAll()

    return teams
  })

  return (
    <main className="py-10">
      <div className="flex flex-col gap-10">
        <h1 className="text-gray-100 font-bold text-3xl">
          Menu de acesso rápido
        </h1>
        <div className="grid grid-cols-4 gap-5">
          <FastAccessCard href="/admin/import">
            <UploadSimple size={32} /> Importar cronôgrama
          </FastAccessCard>
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
