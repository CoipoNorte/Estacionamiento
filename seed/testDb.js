// testDb.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

;(async () => {
  console.log("DB URL →", process.env.DATABASE_URL);
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log("Users in DB →", users);
  process.exit();
})();
