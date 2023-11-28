import { MagnifyingGlass } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'
import { teamsGetAll } from '@/services/api/requests/get'
import { ChangeEvent, useState } from 'react'
import { TeamsSection } from './components/TeamsSection'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'

export default function Team() {
  const [teamSearch, setTeamSearch] = useState('')
  const [filter, setFilter] = useState('')
  const { data: teams, isLoading } = useQuery(['teams', filter], async () => {
    const data = await teamsGetAll(filter)
    return data
  })

  function handleChangeFilter(newFilter: string) {
    setFilter(newFilter)
  }

  if (!teams) {
    return <p>Erro ao buscar turmas!</p>
  }

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-start gap-6 md:m-auto md:max-w-lg `}
    >
      <div className="flex w-full flex-col gap-1">
        <label className="text-xs font-bold text-gray-100" htmlFor="search">
          Pesquisar turma
        </label>
        <div className="relative w-full ">
          <input
            name="search"
            id="search"
            type="text"
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTeamSearch(event.target.value)
            }}
            value={teamSearch}
          />
          <button
            onClick={() => setFilter(teamSearch)}
            className="absolute right-0 h-full px-4 text-gray-100"
          >
            <MagnifyingGlass size={24} />
          </button>
        </div>
      </div>
      <h1 className="self-start text-base text-stone-400">
        {teams.length > 0
          ? 'Aqui estão suas turmas'
          : 'Não foram encontrados resultados'}
      </h1>
      <hr className="w-full border border-stone-600" />
      <TeamsSection
        handleChangeFilter={handleChangeFilter}
        teams={teams}
        isFetching={isLoading}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    }
  }
  if (!session.user.teamId) {
    return {
      redirect: {
        destination: '/register/form-step',
      },
      props: {},
    }
  }

  return {
    props: {},
  }
}
