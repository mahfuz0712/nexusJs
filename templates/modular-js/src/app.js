import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthModule from "./modules/health/health.routes.js";
import { notFound, errorHandler } from "./shared/middleware/error.middleware.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/health", healthModule);
app.use(notFound);
app.use(errorHandler);
export default app;
