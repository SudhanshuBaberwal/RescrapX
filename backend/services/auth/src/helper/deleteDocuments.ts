import { supabase } from "../config/supabase.js";

export const deleteDocuments = async (paths: string[]) => {
    const validPaths = paths.filter(Boolean);

    if (!validPaths.length) return;

    const { error } = await supabase.storage
        .from("partner-documents")
        .remove(validPaths);

    if (error) {
        throw error;
    }
};