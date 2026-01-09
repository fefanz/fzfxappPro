'use client';

import { Fragment } from "react";
import { describeLevel } from "../utils/scoring";
import { Trade } from "../types";
import styles from "./TradeModal.module.css";

type TradeModalProps = {
  trade: Trade | null;
  onClose: () => void;
};

export function TradeModal({ trade, onClose }: TradeModalProps) {
  if (!trade) return null;

  const infoLevel = describeLevel(trade.score);
  const date = new Date(trade.date || trade.timestamp);
  const dateStr = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mapResult = () => {
    if (trade.result === "Gain") return "WIN (TP)";
    if (trade.result === "Loss") return "LOSS (SL)";
    if (trade.result === "Break-even") return "BREAK-EVEN";
    if (trade.result === "Not executed") return "Not executed";
    return "N/A";
  };

  const noteLines = trade.notes ? trade.notes.split("\n") : [];

  return (
    <div className={`${styles.modalBackdrop} ${styles.modalBackdropOpen}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Trade details</div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className={styles.modalGrid}>
          <div>
            <div className={styles.modalLabel}>Pair / Asset</div>
            <div className={styles.modalValue}>{trade.pair || "-"}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>Direction</div>
            <div className={styles.modalValue}>{trade.direction || "-"}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>Date</div>
            <div className={styles.modalValue}>{dateStr}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>Session</div>
            <div className={styles.modalValue}>{trade.session || "-"}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>Score</div>
            <div className={styles.modalValue}>
              {trade.score}% • {infoLevel.level}
            </div>
          </div>
          <div>
            <div className={styles.modalLabel}>Outcome</div>
            <div className={styles.modalValue}>{mapResult()}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>Risk</div>
            <div className={styles.modalValue}>{trade.risk || "-"}</div>
          </div>
          <div>
            <div className={styles.modalLabel}>P&L</div>
            <div className={styles.modalValue}>{trade.pnl || "-"}</div>
          </div>
        </div>

        <div className={styles.modalSectionTitle}>Notes</div>
        <div className={styles.modalNotes}>
          {noteLines.length
            ? noteLines.map((line, idx) => (
                <Fragment key={`${line}-${idx}`}>
                  {line}
                  {idx < noteLines.length - 1 && <br />}
                </Fragment>
              ))
            : "No notes."}
        </div>

        <div className={styles.modalSectionTitle}>Confluences marked</div>
        <div className={styles.modalNotes}>
          {trade.activeConfluences && trade.activeConfluences.length
            ? trade.activeConfluences.join(", ")
            : "None"}
        </div>

        <div className={styles.modalSectionTitle}>Chart images (links)</div>
        <div className={styles.linkRow}>
          <div>
            <span className={styles.modalLabel}>Before</span>
            <br />
            {trade.beforeImg ? (
              <a href={trade.beforeImg} target="_blank" rel="noreferrer" className={styles.chartLink}>
                {trade.beforeImg}
              </a>
            ) : (
              <span style={{ fontSize: 10, color: "#7ea0c0" }}>No link saved.</span>
            )}
          </div>
          <div>
            <span className={styles.modalLabel}>After</span>
            <br />
            {trade.afterImg ? (
              <a href={trade.afterImg} target="_blank" rel="noreferrer" className={styles.chartLink}>
                {trade.afterImg}
              </a>
            ) : (
              <span style={{ fontSize: 10, color: "#7ea0c0" }}>No link saved.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

