import { ArrowBendUpLeft } from 'phosphor-react'
import { ImportExcel } from './components/ImportExcel'
import { useRouter } from 'next/router'
import { DownloadExample } from './components/DownloadExample'
import { GetServerSideProps } from 'next'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'

export default function ImportPage() {
  const { back } = useRouter()
  return (
    <main className="flex flex-col gap-20 py-10">
      <header className="flex items-center gap-4">
        <button onClick={back} className="p-2 text-gray-100 hover:opacity-70">
          <ArrowBendUpLeft size={36} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-100">
            Importe sua planilha de aulas!
          </h1>
          <p className="px-2\ text-xs font-medium text-gray-500">
            A planilha deve seguir o padrão pré-definido pelo sistema!
          </p>
        </div>
      </header>
      <div className="flex h-full w-full gap-20 px-32">
        <ImportExcel />
        <DownloadExample />
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  if (session?.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/home',
      },
      props: {},
    }
  }

  return {
    props: {},
  }
}
