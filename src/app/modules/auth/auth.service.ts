import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/appError";
import { createAdminTokens } from "../../utils/adminTokens";

interface LoginPayload {
  email: string;
  password: string;
}

// Admin login service
const credentialsLogin = async (payload: LoginPayload) => {
  const { email, password } = payload;

  // Check if user exists
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  // Check if password matches
  const isPasswordMatched = await bcryptjs.compare(
    password,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect Password");
  }

  // Generate tokens
  const userTokens = createAdminTokens(isUserExist);
  const { password: pass, ...userWithoutPassword } = isUserExist;

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userWithoutPassword,
  };
};

export const AuthServices = {
  credentialsLogin,
};
