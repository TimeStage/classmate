import { Course } from '@/models/classes'
import { api } from '..'

interface AdminImportFileProps {
  courses: Course[]
}

export async function adminImportFile({ courses }: AdminImportFileProps) {
  try {
    const { data } = await api.post('/admin/import', {
      courses,
    })
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error on importing file')
  }
}
