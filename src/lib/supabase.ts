import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "[Supabase] Missing env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
  );
}

export const supabase = createClient(
  SUPABASE_URL || "https://example.supabase.co",
  SUPABASE_KEY || "public-anon-key-placeholder",
);

export async function recordVisitAndGetCount(): Promise<number> {
  const SESSION_KEY = "pf_visit_counted";

  try {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      const { data } = await supabase
        .from("visit_counter")
        .select("hits")
        .single();
      return (data?.hits as number) ?? 0;
    }

    const { data, error } = await supabase.rpc("increment_visits");
    if (error) throw error;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    return data as number;
  } catch (err) {
    console.error("[Visits]", err);
    const { data } = await supabase
      .from("visit_counter")
      .select("hits")
      .single();
    return (data?.hits as number) ?? 0;
  }
}

export function subscribeToVisits(callback: (count: number) => void) {
  return supabase
    .channel("visit-counter")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "visit_counter",
      },
      (payload) => {
        const newCount = payload.new?.hits as number;
        if (typeof newCount === "number") callback(newCount);
      },
    )
    .subscribe();
}
