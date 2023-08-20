import { z } from 'zod'

export const importExcelRequestSchema = z.object({
  file: z.any(),
})
