import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";

// Create admin user
const createUser = async (userData: Prisma.UserCreateInput) => {
  // Hash password before saving
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const result = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

export const userServices = {
  createUser,
};
