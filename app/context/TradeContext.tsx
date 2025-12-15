'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { syncTradeToSupabase } from "../lib/supabase";
import { Trade } from "../types";

type TradeContextValue = {
  trades: Trade[];
  hydrated: boolean;
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void;
  deleteTrade: (id: string) => void;
  clearTrades: () => void;
  updateTrade: (id: string, data: Partial<Trade>) => void;
};

const STORAGE_KEY = "fzfx_trades_v3_en";

const TradeContext = createContext<TradeContextValue | undefined>(undefined);

function loadFromStorage(): Trade[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function TradeProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTrades(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    } catch {
      // ignore write errors (e.g., private mode)
    }
  }, [trades, hydrated]);

  const addTrade = useCallback((trade: Omit<Trade, "id" | "timestamp">) => {
    const now = Date.now();
    const next: Trade = { ...trade, id: String(now), timestamp: now };
    setTrades((prev) => [next, ...prev]);
    syncTradeToSupabase(next);
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearTrades = useCallback(() => {
    setTrades([]);
  }, []);

  const updateTrade = useCallback((id: string, data: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...data };
        syncTradeToSupabase(updated);
        return updated;
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ trades, hydrated, addTrade, deleteTrade, clearTrades, updateTrade }),
    [addTrade, clearTrades, deleteTrade, hydrated, trades, updateTrade],
  );

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
}

export function useTradeContext() {
  const ctx = useContext(TradeContext);
  if (!ctx) {
    throw new Error("useTradeContext must be used within a TradeProvider");
  }
  return ctx;
}

