
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createActivityLog = async (
  actionType: string,
  tableName: string,
  recordId: number,
  id_users: number | null,
) => {
  console.log(prisma.activityLog);
  const activityLog = await prisma.activityLog.create({
    data: {
      actionType,
      tableName,
      recordId,
      id_users,
    },
  });

  return activityLog;
};
