import Image from 'next/image'
import background from '@/assets/background-home.png'
import { GoogleLogo } from 'phosphor-react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/Button'

export default function Home() {
  return (
    <div>
      <Image
        className="h-full object-cover w-full -z-10 absolute top-0 left-0 overflow-hidden blur-[6px] "
        width={500}
        height={500}
        src={background}
        alt=""
      />
      <main
        className={`w-full h-screen flex justify-center items-center font-roboto`}
      >
        <div className="bg-zinc-900 flex flex-col justify-center items-center rounded-lg gap-8">
          <h1 className="text-gray-100 font-bold text-5xl ">CEDUP CLASS</h1>
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            <Button
              className="bg-red-500"
              onClick={() => {
                signIn('google')
              }}
            >
              <GoogleLogo size={16} />
              Entrar com Google
            </Button>
            <h2 className="text-stone-400 font-normal text-xs">
              Veja os horários de suas aulas atualizado!
            </h2>
          </div>
        </div>
      </main>
    </div>
  )
}
