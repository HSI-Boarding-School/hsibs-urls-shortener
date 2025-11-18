import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing supabase credentials")
}

// export client to get use anywhere in aplication
export const supabase = createClient(supabaseUrl, supabaseAnonKey)