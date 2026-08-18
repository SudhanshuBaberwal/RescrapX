import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import auctionRoutes from "./routes/auction.route.js";
const app = express();
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({
    limit: "10mb"
}));
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
app.get("/health", (_, res) => {
    res.json({
        success: true,
        service: "Auction Service"
    });
});
app.use("/", auctionRoutes);
export default app;
