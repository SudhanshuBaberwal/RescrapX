import { supabase } from "../config/supabase.js";

async function testConnection() {
  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error("❌ Connection Failed");
    console.error(error);
    return;
  }

  console.log("✅ Connected Successfully");
  console.log(data);
}

testConnection();