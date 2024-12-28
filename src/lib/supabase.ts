import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
): Promise<string> {
  try {
    const fileName = `meetings/${Date.now()}-${file.name}`; // Use a unique file name

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from("meetings") // Replace 'meetings' with your actual Supabase bucket name
      .upload(fileName, file);

    if (error) throw error;

    // Set progress to 100% after upload is complete
    if (setProgress) setProgress(100);

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("meetings")
      .getPublicUrl(fileName);

    if (!publicUrlData.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    return publicUrlData.publicUrl; // Return the file's public URL
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
