import Link from 'next/link'
import { DownloadSimple } from 'phosphor-react'

export function DownloadExample() {
  return (
    <div className="flex h-full w-full flex-col">
      <Link
        className={`relative flex w-full flex-col items-center justify-center gap-4 rounded-t-md border-4 border-b-0 border-dashed border-green-500 p-20 transition-all hover:opacity-80 `}
        href={'/uploads/exemplo_de_planilha_de_aulas.xlsx'}
      >
        <DownloadSimple className={`text-green-500`} size={32} />
        <p className={`text-lg font-bold text-green-500`}>
          Baixar padrão de planilha
        </p>
      </Link>
      <button
        className={`flex h-full flex-col items-center justify-center rounded-b-md bg-green-500 px-10 py-5 font-semibold text-white transition-all hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-70`}
      >
        Tutorial
      </button>
    </div>
  )
}
