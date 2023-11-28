import { z } from 'zod'

export const updateUser = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  teamId: z.string().optional(),
})
