import { adminImportFile } from '@/services/api/requests/post'
import { UploadSimple } from 'phosphor-react'
import { useState } from 'react'
import Excel from 'exceljs'
import { toast } from 'react-toastify'

export function ImportExcel() {
  const [file, setFile] = useState<File | undefined>()

  async function handleUploadFile() {
    if (!file) {
      return
    }

    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(file)

    workbook.worksheets[0].findRows(0, 50)

    const worksheet = workbook.worksheets[0].model

    await adminImportFile({ rows: worksheet.rows.splice(0, 50) })
  }

  const selectedColor = file ? 'sky-500' : 'amber-500'
  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`flex flex-col gap-4 justify-center rounded-t-md items-center p-20 relative border-4 hover:opacity-80 transition-all w-full border-b-0 border-dashed border-${selectedColor} `}
      >
        <UploadSimple className={`text-${selectedColor}`} size={32} />
        <p className={`text-${selectedColor} font-bold text-lg`}>
          Arraste e solte!
        </p>
        <input
          className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              if (
                ![
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  '',
                ].includes(event.target.files[0].type)
              ) {
                toast.error('Arquivo selecionado tem o formato errado!')
                setFile(undefined)
                return
              }
              setFile(event.target.files[0])
            }
          }}
          type="file"
        />
      </div>
      <button
        disabled={!file}
        className={`flex flex-col h-full transition-all hover:opacity-70 justify-center items-center bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-10 py-5 rounded-b-md`}
        onClick={handleUploadFile}
      >
        Importar
      </button>
    </div>
  )
}
