import { NextApiRequest, NextApiResponse } from 'next'
import Excel from 'exceljs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'
import dayjs from 'dayjs'

export default async function GetAll(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'OPTIONS' && req.method !== 'GET') {
      return res.status(405)
    }

    const { id } = req.query

    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(401).end()
    }

    const weekDays = await prisma.weekDay.findMany({
      where: {
        teamId: String(id),
      },
      orderBy: {
        weekDay: 'asc',
      },
      include: {
        Class: {
          orderBy: {
            hour: 'asc',
          },
        },
      },
    })

    const classes = weekDays.map(({ Class, ...weekDay }) => {
      const classes = Class.map(({ hour, ...dayClass }) => {
        return {
          ...dayClass,
          hour: dayjs(hour).toISOString(),
        }
      })

      return {
        ...weekDay,
        classes,
      }
    })

    res.status(200).json(classes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error when searching for courses' })
  }
}
