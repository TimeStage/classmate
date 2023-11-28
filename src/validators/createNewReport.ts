import { z } from 'zod'

export const createNewReportSchema = z.object({
  userId: z.string(),
  description: z.string(),
})
