import { Confluence } from "../types";

export const confluences: Confluence[] = [
  { id: "weekly", label: "WEEKLY", weight: 10, helper: "Higher timeframe weekly trend aligned" },
  { id: "daily", label: "DAILY", weight: 10, helper: "Daily trend aligned" },
  { id: "h4", label: "4H", weight: 10, helper: "4H trend aligned" },
  { id: "aoi", label: "AOI", weight: 20, helper: "Strong area of interest" },
  { id: "bos", label: "BOS / SHIFT", weight: 15, helper: "Break of structure in your direction" },
  { id: "fibo", label: "FIBO 62%", weight: 10, helper: "Prime fib retracement (around 62%)" },
  { id: "medias", label: "EMAs", weight: 10, helper: "EMAs stacked in clear trend" },
  { id: "retest", label: "RETEST", weight: 10, helper: "Clean break & retest" },
  { id: "tl", label: "TL / FLAG", weight: 8, helper: "Trendline / flag / channel structure" },
  { id: "candle", label: "CANDLE", weight: 5, helper: "Strong trigger candle (engulfing, hammer, etc.)" },
  { id: "poc", label: "POC", weight: 5, helper: "Point of control / volume node at entry" },
  { id: "ob", label: "ORDER BLOCK", weight: 5, helper: "Clean OB inside AOI" },
];

