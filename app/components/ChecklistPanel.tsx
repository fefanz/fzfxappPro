'use client';

import { confluences } from "../data/confluences";
import { ConfluenceSelection, describeLevel } from "../utils/scoring";
import { TradeFormState } from "../types";
import styles from "./ChecklistPanel.module.css";

type ChecklistPanelProps = {
  selection: ConfluenceSelection;
  onToggle: (id: string) => void;
  form: TradeFormState;
  onFormChange: (field: keyof TradeFormState, value: string) => void;
  onSave: () => void;
  total: number;
  levelInfo: ReturnType<typeof describeLevel>;
  saveLabel?: string;
};

export function ChecklistPanel({
  selection,
  onToggle,
  form,
  onFormChange,
  onSave,
  total,
  levelInfo,
  saveLabel = "Save this setup",
}: ChecklistPanelProps) {
  const badgeClass =
    levelInfo.badgeClass === "low"
      ? styles.badgeLow
      : levelInfo.badgeClass === "medium"
        ? styles.badgeMedium
        : levelInfo.badgeClass === "high"
          ? styles.badgeHigh
          : styles.badgeAplus;

  return (
    <section>
      <div className={styles.grid}>
        {confluences.map((conf) => {
          const isActive = !!selection[conf.id];
          return (
            <div key={conf.id} className={`${styles.card} ${isActive ? styles.cardActive : ""}`}>
              <div className={styles.cardLabel}>{conf.label}</div>
              <div className={styles.cardValue}>{conf.weight}%</div>
              <div className={styles.cardFooter}>
                <div className={styles.cardHelper}>{conf.helper}</div>
                <label className={styles.toggleWrapper}>
                  <span>{isActive ? "On" : "Off"}</span>
                  <div className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onToggle(conf.id)}
                      aria-label={`Toggle ${conf.label}`}
                    />
                    <span className={styles.slider} />
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.totalSection}>
        <div className={styles.totalLabel}>Total overall score</div>
        <div className={styles.totalValue}>{total}%</div>
        <div className={`${styles.badge} ${badgeClass}`}>{levelInfo.level}</div>
        <div className={styles.totalCaption}>{levelInfo.caption}</div>
      </div>

      <div className={styles.notesSection}>
        <div className={styles.fieldset}>
          <div className={styles.fieldsetTitle}>Trade plan</div>
          <label className={styles.smallLabel} htmlFor="pairInput">
            Pair / Asset
          </label>
          <input
            id="pairInput"
            className={styles.textInput}
            placeholder="Ex: XAUUSD, NAS100, EURUSD..."
            value={form.pair}
            onChange={(e) => onFormChange("pair", e.target.value)}
          />
          <div className={styles.row2} style={{ marginTop: 6 }}>
            <div>
              <label className={styles.smallLabel} htmlFor="directionInput">
                Direction
              </label>
              <select
                id="directionInput"
                className={styles.selectInput}
                value={form.direction}
                onChange={(e) => onFormChange("direction", e.target.value)}
              >
                <option value="">Select...</option>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
              <label className={styles.smallLabel} htmlFor="sessionInput">
                Session / Time
              </label>
              <input
                id="sessionInput"
                className={styles.textInput}
                placeholder="London, NY, Gold NYO, etc."
                value={form.session}
                onChange={(e) => onFormChange("session", e.target.value)}
              />
            </div>
          </div>
          <label className={styles.smallLabel} htmlFor="notesInput" style={{ marginTop: 6 }}>
            Quick notes
          </label>
          <textarea
            id="notesInput"
            className={styles.textarea}
            placeholder="Why does this trade make sense? Structure, liquidity, news, higher timeframe context..."
            value={form.notes}
            onChange={(e) => onFormChange("notes", e.target.value)}
          />
        </div>

        <div className={styles.fieldset}>
          <div className={styles.fieldsetTitle}>Risk, result & screenshots</div>
          <label className={styles.smallLabel} htmlFor="riskInput">
            Risk (R or %)
          </label>
          <input
            id="riskInput"
            className={styles.textInput}
            placeholder="Ex: 0.5R, 1R, 0.25%..."
            value={form.risk}
            onChange={(e) => onFormChange("risk", e.target.value)}
          />
          <div className={styles.row2} style={{ marginTop: 6 }}>
            <div>
              <label className={styles.smallLabel} htmlFor="pnlInput">
                P&L result (optional)
              </label>
              <input
                id="pnlInput"
                className={styles.textInput}
                placeholder="Ex: +200, -100, +0.8R"
                value={form.pnl}
                onChange={(e) => onFormChange("pnl", e.target.value)}
              />
            </div>
            <div>
              <label className={styles.smallLabel} htmlFor="resultInput">
                Final outcome
              </label>
              <select
                id="resultInput"
                className={styles.selectInput}
                value={form.result}
                onChange={(e) => onFormChange("result", e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Gain">Gain (TP)</option>
                <option value="Loss">Loss (SL)</option>
                <option value="Break-even">Break-even</option>
                <option value="Not executed">Not executed</option>
              </select>
            </div>
          </div>
          <label className={styles.smallLabel} htmlFor="dateInput" style={{ marginTop: 6 }}>
            Trade date
          </label>
          <input
            id="dateInput"
            type="date"
            className={styles.textInput}
            value={form.date}
            onChange={(e) => onFormChange("date", e.target.value)}
          />
          <label className={styles.smallLabel} htmlFor="beforeImgInput" style={{ marginTop: 6 }}>
            Screenshot BEFORE (link)
          </label>
          <input
            id="beforeImgInput"
            className={styles.textInput}
            placeholder="URL of the chart before entry"
            value={form.beforeImg}
            onChange={(e) => onFormChange("beforeImg", e.target.value)}
          />
          <label className={styles.smallLabel} htmlFor="afterImgInput" style={{ marginTop: 6 }}>
            Screenshot AFTER (link)
          </label>
          <input
            id="afterImgInput"
            className={styles.textInput}
            placeholder="URL of the chart after result"
            value={form.afterImg}
            onChange={(e) => onFormChange("afterImg", e.target.value)}
          />
          <button className={styles.saveBtn} onClick={onSave}>
            {saveLabel}
          </button>
          <div className={styles.hint}>Trades are stored only on this device (localStorage). Ideal for a personal journal.</div>
        </div>
      </div>
    </section>
  );
}

