import dotenv from "dotenv";
import app from "./app.ts";
import env  from "./config/env.ts";
dotenv.config();

app.listen(env.PORT, () => {
  console.log("================================");
  console.log("Gateway Started 🚀");
  console.log(`http://localhost:${env.PORT}`);
  console.log("================================");
});
