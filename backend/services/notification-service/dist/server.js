import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
const PORT = Number(process.env.PORT) || 8002;
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`
====================================================
📨 RescrapX Notification Service Started
====================================================
Environment : ${process.env.NODE_ENV}
Port        : ${PORT}
URL         : http://localhost:${PORT}
Health      : http://localhost:${PORT}/health
====================================================
`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start Notification Service");
        console.error(error);
        process.exit(1);
    }
};
startServer();
