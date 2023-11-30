import dayjs from 'dayjs'
import { z } from 'zod'

export const importExcelRequestSchema = z.object({
  courses: z.array(
    z.object({
      name: z.string(),
      teams: z.array(
        z.object({
          name: z.string(),
          weekDays: z.array(
            z.object({
              weekDay: z.string(),
              classes: z.array(
                z.object({
                  name: z.string(),
                  hour: z.string().transform((val) => dayjs(val).toDate()),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ),
})

export const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'TEATCHER', 'STUDENT']),
})
