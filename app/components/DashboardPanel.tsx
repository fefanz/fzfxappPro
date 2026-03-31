'use client';

import { useMemo } from "react";
import { Trade } from "../types";
import styles from "./DashboardPanel.module.css";

type DashboardPanelProps = {
  trades: Trade[];
  month: number;
  year: number;
  onChangeMonth: (delta: number) => void;
  onResetMonth: () => void;
};

function parseNumericPnl(pnlStr: string) {
  if (!pnlStr) return 0;
  const cleaned = pnlStr.replace(/[^\d\-\.,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function DashboardPanel({ trades, month, year, onChangeMonth, onResetMonth }: DashboardPanelProps) {
  const { totals, calendarDays, recentTrades } = useMemo(() => {
    const totalTrades = trades.length;
    const wins = trades.filter((t) => t.result === "Gain").length;
    const winRate = totalTrades ? Math.round((wins / totalTrades) * 100) : 0;

    const pnlByPair: Record<string, number> = {};
    let totalPnlValue = 0;

    trades.forEach((t) => {
      const num = parseNumericPnl(t.pnl);
      totalPnlValue += num;
      const key = t.pair || "N/A";
      pnlByPair[key] = (pnlByPair[key] || 0) + num;
    });

    let bestPair = "-";
    let bestVal = -Infinity;
    let worstPair = "-";
    let worstVal = Infinity;

    Object.entries(pnlByPair).forEach(([pair, val]) => {
      if (val > bestVal) {
        bestVal = val;
        bestPair = pair;
      }
      if (val < worstVal) {
        worstVal = val;
        worstPair = pair;
      }
    });

    const sorted = trades.slice().sort((a, b) => b.timestamp - a.timestamp);
    const recent = sorted.slice(0, 8);

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

    const pnlByDay: Record<number, number> = {};
    trades.forEach((t) => {
      const d = new Date(t.date || t.timestamp);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        pnlByDay[day] = (pnlByDay[day] || 0) + parseNumericPnl(t.pnl);
      }
    });

    const calendarCells: Array<{ key: string; label?: string; pnl?: number }> = [];
    weekdays.forEach((w, idx) => calendarCells.push({ key: `head-${idx}-${w}`, label: w }));
    for (let i = 0; i < startWeekday; i += 1) {
      calendarCells.push({ key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      calendarCells.push({ key: `day-${day}`, label: String(day), pnl: pnlByDay[day] });
    }

    return {
      totals: {
        totalTrades,
        winRate,
        bestPair,
        worstPair,
        totalPnlValue,
      },
      calendarDays: calendarCells,
      recentTrades: recent,
    };
  }, [month, trades, year]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const calendarLabel = `${monthNames[month]} ${year}`;

  return (
    <section>
      <div className={styles.dashboardLayout}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Calendar & daily P&L</div>
          <div className={styles.calendarHeader}>
            <div id="calendarMonthLabel" style={{ fontSize: 11, color: "#e8f5ff", fontWeight: 600 }}>
              {calendarLabel}
            </div>
            <div className={styles.calendarNav}>
              <button className={styles.calBtn} onClick={() => onChangeMonth(-1)}>
                ◀
              </button>
              <button className={styles.calBtn} onClick={onResetMonth}>
                Today
              </button>
              <button className={styles.calBtn} onClick={() => onChangeMonth(1)}>
                ▶
              </button>
            </div>
          </div>
          <div className={styles.calendarGrid}>
            {calendarDays.map((cell) => {
              if (!cell.label && cell.pnl === undefined) {
                return <div key={cell.key} />;
              }
              if (cell.key.startsWith("head-")) {
                return (
                  <div key={cell.key} className={styles.calDayHeader}>
                    {cell.label}
                  </div>
                );
              }
              const pnl = cell.pnl ?? 0;
              const hasValue = cell.pnl !== undefined;
              const pnlClass = !hasValue
                ? styles.calPnl
                : pnl > 0
                  ? `${styles.calPnl} ${styles.positive}`
                  : pnl < 0
                    ? `${styles.calPnl} ${styles.negative}`
                    : `${styles.calPnl} ${styles.neutral}`;
              const pnlText = !hasValue ? "" : pnl > 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2);
              return (
                <div key={cell.key} className={styles.calCell}>
                  <div className={styles.calDate}>{cell.label}</div>
                  <div className={pnlClass}>{pnlText}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Stats & recent trades</div>
          <div className={styles.statRow}>
            <div className={styles.statLabel}>Total trades</div>
            <div className={styles.statValue}>{totals.totalTrades}</div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.statLabel}>Win rate</div>
            <div className={styles.statValue}>{totals.winRate}%</div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.statLabel}>Best pair (P&L)</div>
            <div className={styles.statValue}>{totals.bestPair}</div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.statLabel}>Worst pair (P&L)</div>
            <div className={styles.statValue}>{totals.worstPair}</div>
          </div>
          <div className={styles.statRow}>
            <div className={styles.statLabel}>Total P&L</div>
            <div className={styles.statValue}>
              {totals.totalTrades ? (totals.totalPnlValue >= 0 ? `+${totals.totalPnlValue.toFixed(2)}` : totals.totalPnlValue.toFixed(2)) : "-"}
            </div>
          </div>
          <div className={styles.panelTitle} style={{ marginTop: 10 }}>
            Recent trades
          </div>
          <div className={styles.recentList}>
            {!recentTrades.length ? (
              <div className={styles.hint}>No trades yet.</div>
            ) : (
              recentTrades.map((t) => {
                const d = new Date(t.date || t.timestamp);
                const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
                const label = `${t.pair || "No pair"} • ${t.result || "N/A"} • ${t.score}%`;
                const pnl = t.pnl || "-";
                return (
                  <div key={t.id} className={styles.recentItem}>
                    <span>{label}</span>
                    <span>
                      {dateStr} • {pnl}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

