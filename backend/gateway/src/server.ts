import dotenv from "dotenv";
import app from "./app.js";
import env  from "./config/env.js";
dotenv.config();

app.listen(env.PORT, () => {
  console.log("================================");
  console.log("Gateway Started 🚀");
  console.log(`http://localhost:${env.PORT}`);
  console.log("================================");
});
