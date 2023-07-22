// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function getUserByAccount(provider: string, type: string) {
//   const user = await prisma.user.findFirst({
//     where: {
//       accounts: {
//         some: {
//           provider,
//           type,
//         },
//       },
//     },
//   });
//   return {user};
// }
