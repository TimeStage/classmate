import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, email } = req.body;

      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          
        },
      });

      return res.status(201).json(createdUser);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
