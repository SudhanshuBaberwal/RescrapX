import fs from "fs";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

async function main() {
  const buffer = fs.readFileSync("./sample.pdf");

  const result = await uploadToSupabase(
    {
      originalname: "sample.pdf",
      mimetype: "application/pdf",
      buffer,
    },
    "partners/test-user"
  );

  console.log(result);
}

main();