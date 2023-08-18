import { z } from 'zod'

export const updateClassSchema = z.object({
  teamId: z.string(),
  userEmail: z.string().email(),
})
