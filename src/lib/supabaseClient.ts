import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// fungsi upload
export const uploadFileToSupabase = async (file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from("evidence") 
      .upload(`public/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
