import { createClient } from "@supabase/supabase-js";

// L'URL et la clé "anon" sont publiques par conception (RLS protège les données).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://fskbjahqstkorgydkxdz.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZza2JqYWhxc3Rrb3JneWRreGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzkxNzEsImV4cCI6MjA5NzcxNTE3MX0.wOBJQQwhxDaB5f9mEIM5SF5wUThVRPwWlCnHGMijfSU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
