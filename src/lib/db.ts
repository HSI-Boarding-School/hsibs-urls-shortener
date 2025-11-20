import { CreateUrlDto, UpdateUrlDto, Url } from "@/types/database";
import { supabase } from "./supabase";
import { TABLES } from "./constants";

export const db = {
  urls: {
    // create new URL functions
    async create(data: CreateUrlDto): Promise<Url | null> {
      const { data: result, error } = await supabase
        .from(TABLES.URLS)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.log("Error Creating URL", error);
        return null;
      }

      return result;
    },

    // find by short code
    async findByShortCode(shortCode: string): Promise<Url | null> {
      const { data, error } = await supabase
        .from(TABLES.URLS)
        .select("*")
        .eq("short_code", shortCode)
        .eq("is_active", true)
        .single();

      if (error) {
        console.log("Error Creating URL", error);
        return null;
      }

      return data;
    },

    // get all urls
    async getAll(): Promise<Url[]> {
      const { data, error } = await supabase
        .from(TABLES.URLS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching Urls : ", error);
        return [];
      }

      return data || [];
    },

    // increment click count
    async incrementClick(id: string): Promise<boolean> {
      const { error } = await supabase.rpc("increment_click", { url_id: id });

      if (error) {
        console.error("Error incrementing clicks:", error);
        return false;
      }

      return true;
    },

    // update urls
    async update(id: string, data: UpdateUrlDto): Promise<Url | null> {
      const { data: result, error } = await supabase
        .from(TABLES.URLS)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating URL:", error);
        return null;
      }

      return result;
    },

    // delete url
    async delete(id: string): Promise<boolean> {
      const { error } = await supabase.from(TABLES.URLS).delete().eq("id", id);

      if (error) {
        console.error("Error deleting URL:", error);
        return false;
      }

      return true;
    },

    // check if there is exist short code
    async shortCodeExist(shortCode: string): Promise<boolean> {
      const { data, error } = await supabase
        .from(TABLES.URLS)
        .select("short_code")
        .eq("short_code", shortCode)
        .maybeSingle();

      return !error && data !== null;
    },
  },
};
