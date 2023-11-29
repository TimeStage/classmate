import { prisma } from "@/lib/prisma";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import {  updateRoleSchema } from "@/validators/admin";
import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    try {
        if (req.method !== "PUT") {
            return res.status(405).end()
        }

        const {userId: id, role}= updateRoleSchema.parse(req.body)

        const session = await getServerSession(
            req,
            res,
            buildNextAuthOptions(req, res),
          )
      
          if (!session || session.user.role !== 'ADMIN') {
            return res.status(401).end()
          }

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        

        const userUpdated = await prisma.user.update({
            where: {
                id,
            },
            data: {
               role: Role[role] 
            }
        })

        

        return res.status(200).json(userUpdated)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Uncauth Error"
        })
    }
}