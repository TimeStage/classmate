import { z } from 'zod'

export const updateUser = z.object({
  name: z.string().optional(),
  teamId: z.string().optional(),
})
