import { randomUUID } from "node:crypto";
import supabase from "../config/supabase.js";
import ApiError from "../lib/ApiError.js";
class SupabaseService {
    /**
     * Helper method to strip the bucket name or leading slashes from paths
     */
    sanitizePath(bucket, path) {
        if (!path)
            return "";
        // Removes leading bucket name if it was saved in DB (e.g., "partner-documents/vehicles/..." -> "vehicles/...")
        const bucketRegex = new RegExp(`^/?${bucket}/?`, "i");
        return path.replace(bucketRegex, "").replace(/^\/+/, "");
    }
    async uploadToSupabase(file, folder, prefix) {
        const extension = file.originalname.split(".").pop();
        const fileName = `${prefix}-${randomUUID()}.${extension}`;
        // Ensure path doesn't have double leading slashes
        const filePath = `${folder}/${fileName}`.replace(/^\/+/, '');
        // Convert Buffer to Uint8Array for native fetch compatibility
        const fileData = new Uint8Array(file.buffer);
        const { data, error } = await supabase.storage
            .from("partner-documents")
            .upload(filePath, fileData, {
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
    async deleteFile(bucket, path) {
        const cleanPath = this.sanitizePath(bucket, path);
        const { error } = await supabase.storage.from(bucket).remove([cleanPath]);
        if (error) {
            throw new ApiError(500, error.message);
        }
    }
    async getSignedUrl(bucket, path, expiresInSeconds = 3600) {
        const cleanPath = this.sanitizePath(bucket, path);
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(cleanPath, expiresInSeconds);
        if (error) {
            throw new ApiError(500, `Supabase Error: ${error.message}`);
        }
        return data.signedUrl;
    }
    async getPublicUrl(bucket, path) {
        const cleanPath = this.sanitizePath(bucket, path);
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(cleanPath);
        return data.publicUrl;
    }
}
export default new SupabaseService();
