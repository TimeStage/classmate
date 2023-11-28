import Image from 'next/image'
import background from '@/assets/background-home.png'
import { GoogleLogo } from 'phosphor-react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/Button'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from './api/auth/[...nextauth].api'

export default function Home() {
  return (
    <main
      className={`-my-24 flex h-screen w-full items-center justify-center font-roboto`}
    >
      <Image
        className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden object-cover blur-[6px] "
        width={500}
        height={500}
        src={background}
        alt=""
      />
      <div className="z-10 flex flex-col items-center justify-center gap-8 rounded-lg bg-zinc-900 p-6">
        <h1 className="text-5xl font-bold text-gray-100 ">CEDUP CLASS</h1>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Button
            className="bg-red-500"
            onClick={() => {
              signIn('google')
            }}
          >
            <GoogleLogo size={16} />
            Entrar com Google
          </Button>
          <h2 className="text-xs font-normal text-stone-400">
            Veja os horários de suas aulas atualizado!
          </h2>
        </div>
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

  if (session && session.user.teamId) {
    return {
      redirect: {
        destination: '/home',
      },
      props: {},
    }
  }
  if (session && !session.user.teamId) {
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
