import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { envVars } from "../config/env";

export const seedAdminUser = async (): Promise<boolean> => {
  try {
    console.log("Starting admin user seeding...");

    const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS } =
      envVars;

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: SUPER_ADMIN_EMAIL }, { username: "anowarzz" }],
      },
    });

    if (existingAdmin) {
      console.log("dmin user already exists. Skipping seeding.");
      return false;
    }

    // hassh the password
    const saltRounds = parseInt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, saltRounds);

    // create admin
    const adminUser = await prisma.user.create({
      data: {
        email: SUPER_ADMIN_EMAIL,
        username: "anowarzz",
        password: hashedPassword,
        name: "Md Anowar Hosen",
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user seeded successfully!");

    return true;
  } catch (error) {
    console.error(" Error seeding admin user:", error);
    throw error;
  }
};
