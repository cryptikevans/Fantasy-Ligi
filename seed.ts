import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tiebreakerOrder = [
    "CAPTAIN_POINTS",
    "FEWEST_TRANSFERS",
    "FINAL_GAMEWEEK_POINTS",
    "SQUAD_VALUE",
    "EARLIEST_LOCK",
    "SEEDED_RANDOM_DRAW"
  ];

  const templates = [
    { name: "Standard", memberCount: 10, entryFee: 100 },
    { name: "Budget", memberCount: 20, entryFee: 50 },
    { name: "VIP", memberCount: 10, entryFee: 200 }
  ];

  for (const t of templates) {
    await prisma.leagueTemplate.upsert({
      where: { name: t.name },
      update: {},
      create: {
        ...t,
        winnerPercentage: 90,
        platformPercentage: 10,
        tiebreakerOrder
      }
    });
  }

  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({
    where: { phone: "0700000000" },
    update: {},
    create: {
      name: "Demo Admin",
      phone: "0700000000",
      email: "admin@fantasyligi.local",
      passwordHash,
      role: "ADMIN",
      phoneVerifiedAt: new Date()
    }
  });

  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());