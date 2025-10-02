import { z } from "zod";

const createUserValidationSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format"),
  username: z
    .string({ message: "Username is required" })
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
});

export const UserValidations = {
  createUserValidationSchema,
};
