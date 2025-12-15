'use client';

import { useMemo } from "react";
import { describeLevel } from "../utils/scoring";
import { Trade } from "../types";
import styles from "./HistoryPanel.module.css";

export type HistoryFilter = "ALL" | "WIN" | "LOSS" | "BE" | "NE";

type HistoryPanelProps = {
  trades: Trade[];
  filter: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
  onView: (id: string) => void;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export function HistoryPanel({
  trades,
  filter,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  const filtered = useMemo(() => {
    const sorted = [...trades].sort((a, b) => b.timestamp - a.timestamp);
    return sorted.filter((t) => {
      if (filter === "ALL") return true;
      if (filter === "WIN") return t.result === "Gain";
      if (filter === "LOSS") return t.result === "Loss";
      if (filter === "BE") return t.result === "Break-even";
      if (filter === "NE") return t.result === "Not executed";
      return true;
    });
  }, [filter, trades]);

  return (
    <section>
      <div className={styles.historyHeader}>
        <div className={styles.filters}>
          {[
            { key: "ALL", label: "ALL" },
            { key: "WIN", label: "WIN" },
            { key: "LOSS", label: "LOSS" },
            { key: "BE", label: "BREAKEVEN" },
            { key: "NE", label: "NOT EXECUTED" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.filterBtnActive : ""}`}
              onClick={() => onFilterChange(key as HistoryFilter)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className={styles.clearBtn}
          onClick={() => {
            if (confirm("Clear ALL saved trades from this device?")) onClear();
          }}
        >
          Clear history
        </button>
      </div>
      <div className={styles.historyList}>
        {!filtered.length ? (
          <div className={styles.hint}>No trades for this filter yet.</div>
        ) : (
          filtered.map((trade) => {
            const infoLevel = describeLevel(trade.score);
            const date = new Date(trade.date || trade.timestamp);
            const dateStr = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            let resultClass = styles.resultNe;
            let resultText = trade.result || "N/A";
            if (trade.result === "Gain") {
              resultClass = styles.resultWin;
              resultText = "WIN";
            } else if (trade.result === "Loss") {
              resultClass = styles.resultLoss;
              resultText = "LOSS";
            } else if (trade.result === "Break-even") {
              resultClass = styles.resultBe;
              resultText = "BE";
            }

            const pnlColor = (trade.pnl || "").trim().startsWith("-") ? "#ffb3b3" : "#9dffbf";

            return (
              <div key={trade.id} className={styles.tradeCard}>
                <div className={styles.tradeTop}>
                  <div>
                    <div className={styles.pair}>{trade.pair || "No pair"}</div>
                    <div className={styles.metaLine}>
                      {dateStr} • {trade.session || "Session not set"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={`${styles.resultPill} ${resultClass}`}>{resultText}</div>
                    <div style={{ fontSize: 10, color: "#9fb7d8" }}>
                      {trade.score}% • {infoLevel.level}
                    </div>
                  </div>
                </div>
                <div className={styles.metaLine}>
                  Direction: <span style={{ color: "#c6e2ff" }}>{trade.direction || "-"}</span> • Risk:{" "}
                  <span style={{ color: "#c6e2ff" }}>{trade.risk || "-"}</span>
                </div>
                <div className={styles.metaLine}>
                  P&L: <span style={{ color: pnlColor }}>{trade.pnl || "-"}</span>
                </div>
                <div className={styles.notesPreview}>
                  <strong>Notes:</strong> {(trade.notes || "No notes.").slice(0, 120)}
                  {trade.notes && trade.notes.length > 120 ? "..." : ""}
                </div>
                <div className={styles.notesPreview}>
                  <strong>Confluences:</strong>{" "}
                  {trade.activeConfluences && trade.activeConfluences.length
                    ? trade.activeConfluences.join(", ")
                    : "None"}
                </div>
                <div className={styles.cardActions}>
                  <button className={`${styles.btnSmall} ${styles.btnSmallView}`} onClick={() => onView(trade.id)}>
                    View
                  </button>
                  <button className={`${styles.btnSmall} ${styles.btnSmallUpdate}`} onClick={() => onEdit(trade)}>
                    Update
                  </button>
                  <button
                    className={`${styles.btnSmall} ${styles.btnSmallDelete}`}
                    onClick={() => {
                      if (confirm("Delete this trade from history?")) onDelete(trade.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

