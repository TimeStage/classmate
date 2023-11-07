import { Spinner } from '@/components/Spinner'

interface ImportButtonLoaderProps {
  loader: number
}

export function ImportButtonLoader({ loader }: ImportButtonLoaderProps) {
  if (loader !== 0) {
    return (
      <>
        <Spinner size={24} />
        {loader}%
      </>
    )
  }
  return <>Importar</>
}
