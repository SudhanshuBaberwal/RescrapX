import { randomUUID } from "crypto";
import { supabase } from "../config/supabase.js";

interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

interface UploadResult {
  path: string;
  fullPath: string;
}

export const uploadToSupabase = async (
  file: UploadedFile,
  folder: string,
  prefix: string, // ✅ New parameter
): Promise<UploadResult> => {
  const extension = file.originalname.split(".").pop();

  const fileName = `${prefix}-${randomUUID()}.${extension}`;

  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("partner-documents")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    path: data.path,
    fullPath: data.fullPath,
  };
};