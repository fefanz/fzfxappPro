'use client';

import { useMemo, useState } from "react";
import { DashboardPanel } from "./components/DashboardPanel";
import { ChecklistPanel } from "./components/ChecklistPanel";
import { HistoryFilter, HistoryPanel } from "./components/HistoryPanel";
import { TradeModal } from "./components/TradeModal";
import { TradeProvider, useTradeContext } from "./context/TradeContext";
import { confluences } from "./data/confluences";
import { calculateScore, ConfluenceSelection, describeLevel } from "./utils/scoring";
import { Trade, TradeFormState } from "./types";
import pageStyles from "./pageStyles.module.css";

type TabKey = "checklist" | "history" | "dashboard";

const initialFormState: TradeFormState = {
  pair: "",
  direction: "",
  session: "",
  notes: "",
  risk: "",
  pnl: "",
  result: "",
  date: "",
  beforeImg: "",
  afterImg: "",
};

const buildEmptySelection = (): ConfluenceSelection => {
  const map: ConfluenceSelection = {};
  confluences.forEach((c) => {
    map[c.id] = false;
  });
  return map;
};

function TradeApp() {
  const { trades, addTrade, deleteTrade, clearTrades, hydrated } = useTradeContext();

  const [tab, setTab] = useState<TabKey>("checklist");
  const [selection, setSelection] = useState<ConfluenceSelection>(buildEmptySelection);
  const [form, setForm] = useState<TradeFormState>(initialFormState);
  const [filter, setFilter] = useState<HistoryFilter>("ALL");
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [saveLabel, setSaveLabel] = useState("Save this setup");

  const { total } = useMemo(() => calculateScore(selection, confluences), [selection]);
  const levelInfo = useMemo(() => describeLevel(total), [total]);

  const selectedTrade = useMemo(
    () => trades.find((t) => t.id === selectedTradeId) || null,
    [selectedTradeId, trades],
  );

  const handleToggle = (id: string) => {
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFormChange = (field: keyof TradeFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const score = calculateScore(selection, confluences);
    const info = describeLevel(score.total);

    if (score.total === 0 && !confirm("Score is 0%. Are you sure you want to save this trade?")) return;

    const now = new Date();
    const chosenDate = form.date ? new Date(`${form.date}T00:00:00`) : now;
    const activeConfluences = score.activeIds.map((id) => confluences.find((c) => c.id === id)?.label || id);

    addTrade({
      date: chosenDate.toISOString(),
      pair: form.pair.trim(),
      direction: form.direction,
      session: form.session.trim(),
      notes: form.notes.trim(),
      risk: form.risk.trim(),
      pnl: form.pnl.trim(),
      result: form.result,
      beforeImg: form.beforeImg.trim(),
      afterImg: form.afterImg.trim(),
      score: score.total,
      level: info.level,
      activeConfluences,
    });

    setSaveLabel("Saved ✅");
    setTimeout(() => setSaveLabel("Save this setup"), 1300);
  };

  const handleEdit = (trade: Trade) => {
    const nextSelection = buildEmptySelection();
    trade.activeConfluences?.forEach((label) => {
      const conf = confluences.find((c) => c.label === label || c.id === label);
      if (conf) nextSelection[conf.id] = true;
    });
    setSelection(nextSelection);
    setForm({
      pair: trade.pair || "",
      direction: trade.direction || "",
      session: trade.session || "",
      notes: trade.notes || "",
      risk: trade.risk || "",
      pnl: trade.pnl || "",
      result: trade.result || "",
      date: trade.date ? new Date(trade.date).toISOString().slice(0, 10) : "",
      beforeImg: trade.beforeImg || "",
      afterImg: trade.afterImg || "",
    });
    setTab("checklist");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeMonth = (delta: number) => {
    setCurrentMonth((prev) => {
      let next = prev + delta;
      if (next < 0) {
        next = 11;
        setCurrentYear((y) => y - 1);
      } else if (next > 11) {
        next = 0;
        setCurrentYear((y) => y + 1);
      }
      return next;
    });
  };

  const resetMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  if (!hydrated) {
    return (
      <div className={pageStyles.app}>
        <div className={pageStyles.subtitle}>Loading your journal...</div>
      </div>
    );
  }

  return (
    <>
      <div className={pageStyles.app}>
        <div className={pageStyles.header}>
          <div>
            <div className={pageStyles.title}>FZFX Trade Validator</div>
            <div className={pageStyles.subtitle}>Confluence checklist + trade journal</div>
          </div>
          <div className={pageStyles.tabs}>
            {(
              [
                { key: "checklist", label: "Checklist" },
                { key: "history", label: "History" },
                { key: "dashboard", label: "Dashboard" },
              ] as Array<{ key: TabKey; label: string }>
            ).map(({ key, label }) => (
              <button
                key={key}
                className={`${pageStyles.tabBtn} ${tab === key ? pageStyles.tabBtnActive : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === "checklist" && (
          <ChecklistPanel
            selection={selection}
            onToggle={handleToggle}
            form={form}
            onFormChange={handleFormChange}
            onSave={handleSave}
            total={total}
            levelInfo={levelInfo}
            saveLabel={saveLabel}
          />
        )}

        {tab === "history" && (
          <HistoryPanel
            trades={trades}
            filter={filter}
            onFilterChange={(f) => setFilter(f)}
            onView={(id) => setSelectedTradeId(id)}
            onEdit={handleEdit}
            onDelete={deleteTrade}
            onClear={clearTrades}
          />
        )}

        {tab === "dashboard" && (
          <DashboardPanel
            trades={trades}
            month={currentMonth}
            year={currentYear}
            onChangeMonth={handleChangeMonth}
            onResetMonth={resetMonth}
          />
        )}
      </div>

      <TradeModal trade={selectedTrade} onClose={() => setSelectedTradeId(null)} />
    </>
  );
}

export default function TradeAppClient() {
  return (
    <TradeProvider>
      <TradeApp />
    </TradeProvider>
  );
}


