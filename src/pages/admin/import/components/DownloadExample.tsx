import Link from 'next/link'
import { DownloadSimple } from 'phosphor-react'

export function DownloadExample() {
  return (
    <div className="flex flex-col w-full h-full">
      <Link
        className={`flex flex-col gap-4 justify-center p-20 rounded-t-md border-b-0 items-center relative border-4 hover:opacity-80 transition-all w-full border-dashed border-green-500 `}
        href={'/uploads/exemplo_de_planilha_de_aulas.xlsx'}
      >
        <DownloadSimple className={`text-green-500`} size={32} />
        <p className={`text-green-500 font-bold text-lg`}>
          Baixar padrão de planilha
        </p>
      </Link>
      <button
        className={`flex flex-col h-full transition-all hover:opacity-70 justify-center items-center bg-green-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-10 py-5 rounded-b-md`}
      >
        Tutorial
      </button>
    </div>
  )
}
