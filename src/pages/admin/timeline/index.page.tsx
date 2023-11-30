import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'

export default function TimelinePage() {
  return (
    <main className="flex max-w-[100vw] flex-col gap-10 overflow-hidden py-10">
      <div>
        <h1>Cursos</h1>
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
