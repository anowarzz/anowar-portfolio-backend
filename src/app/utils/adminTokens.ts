import { envVars } from "../config/env";
import { generateToken } from "./jwt";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const createAdminTokens = (user: User) => {
  // jwt payload
  const jwtPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // access token
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );

  // refresh token
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
