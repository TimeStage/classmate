import { toPng } from 'html-to-image'
import { RefObject } from 'react'
import { toast } from 'react-toastify'

export async function downloadHtml(
  imageName: string,
  htmlDivRef: RefObject<HTMLDivElement>,
) {
  if (!htmlDivRef || !htmlDivRef.current) {
    return toast.error('Ocorreu um erro ao baixar as aulas!')
  }
  htmlDivRef.current.dataset.print = 'true'

  const dataUrl = await toPng(htmlDivRef.current, { cacheBust: false })

  htmlDivRef.current.dataset.print = 'false'

  if (!dataUrl) {
    return toast.error('Ocorreu um erro ao baixar as aulas!')
  }

  const link = document.createElement('a')
  link.download = `${imageName}.png`
  link.href = dataUrl
  link.click()

  return toast.success('Download feito com sucesso!')
}
