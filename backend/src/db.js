const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = { prisma, disconnectDatabase };
