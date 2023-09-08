import { Rows } from 'exceljs'
import { api } from '..'

interface AdminImportFileProps {
  rows: Rows[]
}

export async function adminImportFile({ rows }: AdminImportFileProps) {
  try {
    const { data } = await api.post('/admin/import', {
      rows,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on importing file')
  }
}
