import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// app.use(compression());

app.get("/health", (_, res) => {
  res.json({
    success: true,
    service: "USER SERVICE",
  });
});

export default app;
