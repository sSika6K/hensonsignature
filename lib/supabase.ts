import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://owuyiftsqucnyynhyjpr.supabase.co";
const supabaseKey = "sb_publishable_jM6GRy9DqOWg8jxWmr0GBw_Ur0SS-Zd";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SUPABASE_BUCKET = "guitars";

export function getPublicMediaUrl(path: string) {
  const cleanedPath = path.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${cleanedPath}`;
}
