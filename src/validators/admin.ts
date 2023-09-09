import { z } from 'zod'

export const importExcelRequestSchema = z.object({
  rows: z.any(),
})
