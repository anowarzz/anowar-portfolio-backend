import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { envVars } from "./app/config/env";
import notFound from "./app/errorHelpers/notFound";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

// Parser
app.use(express.json());
app.use(
  cors({
    origin: [envVars.CLIENT_URL as string, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", router);

// Testing API HomeRoute
const test = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome To The Portfolio Server",
    note: "Winter Is Coming",
  });
};

app.get("/", test);

// Global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFound);

export default app;
