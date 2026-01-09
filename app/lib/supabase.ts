import { Trade } from "../types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = process.env.NEXT_PUBLIC_SUPABASE_TABLE || "trades";

export async function syncTradeToSupabase(trade: Trade) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  try {
    const payload = {
      id: trade.id,
      timestamp: trade.timestamp,
      date: trade.date,
      pair: trade.pair,
      direction: trade.direction,
      session: trade.session,
      notes: trade.notes,
      risk: trade.risk,
      pnl: trade.pnl,
      result: trade.result,
      before_img: trade.beforeImg,
      after_img: trade.afterImg,
      score: trade.score,
      level: trade.level,
      active_confluences: trade.activeConfluences || [],
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase sync failed", res.status, text);
    }
  } catch (err) {
    console.error("Supabase sync failed", err);
  }
}

