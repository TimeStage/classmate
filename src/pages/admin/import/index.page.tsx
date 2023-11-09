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
    <main className="flex flex-col py-10 gap-20">
      <header className="flex gap-4 items-center">
        <button onClick={back} className="text-gray-100 p-2 hover:opacity-70">
          <ArrowBendUpLeft size={36} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-gray-100 font-bold text-3xl">
            Importe sua planilha de aulas!
          </h1>
          <p className="text-xs font-medium text-gray-500 px-2\">
            A planilha deve seguir o padrão pré-definido pelo sistema!
          </p>
        </div>
      </header>
      <div className="flex w-full h-full px-32 gap-20">
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
