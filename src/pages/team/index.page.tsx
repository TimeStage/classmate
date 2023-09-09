import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { MagnifyingGlass } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'
import { teamsGetAll } from '@/services/api/requests/get'
import { ChangeEvent, useState } from 'react'
import { TeamsSection } from './components/TeamsSection'

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
      className={`w-full h-full flex flex-col justify-start py-24 items-center gap-6 px-8 `}
    >
      <div className="w-full relative ">
        <input
          type="text"
          className="bg-gray-900 w-full py-3 px-4 text-sm text-gray-100 rounded-lg"
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
      <h1 className="text-base self-start text-stone-400">
        {teams.length > 0
          ? 'Aqui estão suas turmas'
          : 'Não foram encontrados resultados'}
      </h1>
      <hr className="border w-full border-stone-600" />
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

  if (!session?.user || !session.user.email) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  if (!user.teamId) {
    return {
      props: {},
      redirect: {
        destination: '/register/form-step',
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}