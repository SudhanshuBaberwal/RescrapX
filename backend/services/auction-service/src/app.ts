import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import auctionRoutes from "./routes/auction.route.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(compression());

app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(morgan("dev"));

app.get("/health", (_, res) => {
  res.json({
    success: true,
    service: "Auction Service",
  });
});

app.use("/", auctionRoutes);

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("AUCTION SERVICE ERROR:", err);

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      error: {
        code: err.code || "INTERNAL_SERVER_ERROR",
      },
    });
  },
);

export default app;
