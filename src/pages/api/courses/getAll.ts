import { NextApiRequest, NextApiResponse  } from "next";
import { prisma } from "@/lib/prisma";




export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse

    ) {

    if (req.method === 'GET') {
        try {
            const course = await prisma.course.findMany()
            res.status(200).json(course)
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Erro ao buscar cursos"})
            
        }
    }
    
}
