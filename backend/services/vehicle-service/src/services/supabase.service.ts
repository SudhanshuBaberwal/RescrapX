import { randomUUID } from "node:crypto";
import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";

interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

interface UploadResult {
  path: string;
  fullPath: string;
}

class SupabaseService {
  async uploadToSupabase(
    file: UploadedFile,
    folder: string,
    prefix: string, // ✅ New parameter
  ): Promise<UploadResult> {
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
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new ApiError(500, error.message);
    }
  }

  async getSignedUrl(bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (error) {
      throw new ApiError(500, error.message);
    }

    return data.signedUrl;
  }
}

export default new SupabaseService();
