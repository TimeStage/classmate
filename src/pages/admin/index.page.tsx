import { useState } from 'react'
import Excel from 'exceljs'
import { api } from '@/lib/axios'
export default function AdminPage() {
  const [file, setFile] = useState<File>()

  async function handleUploadFile() {
    if (!file) {
      return
    }

    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(file)

    const worksheet = workbook.worksheets[0].model

    const { data } = await api.post('/admin/import', {
      file: worksheet,
    })
  }
  return (
    <main>
      <input
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
          }
        }}
        type="file"
      />
      <button onClick={handleUploadFile}>enviar </button>
    </main>
  )
}
