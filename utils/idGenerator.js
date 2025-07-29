// backend/utils/idGenerator.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Génère un ID au format ADJJMMYYYY-N
export const generateReservationId = async (date) => {
  const [year, month, day] = date.split("-");
  const formattedDate = `${day}${month}${year}`;

  const count = await prisma.reservation.count({
    where: { date },
  });

  const n = count + 1;
  return `AD${formattedDate}-${n}`;
};
