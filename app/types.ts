export type TradeResult = "Gain" | "Loss" | "Break-even" | "Not executed" | "";

export type Confluence = {
  id: string;
  label: string;
  weight: number;
  helper: string;
};

export type Trade = {
  id: string;
  timestamp: number;
  date: string;
  pair: string;
  direction: string;
  session: string;
  notes: string;
  risk: string;
  pnl: string;
  result: TradeResult;
  beforeImg: string;
  afterImg: string;
  score: number;
  level: string;
  activeConfluences: string[];
};

export type TradeFormState = {
  pair: string;
  direction: string;
  session: string;
  notes: string;
  risk: string;
  pnl: string;
  result: TradeResult;
  date: string;
  beforeImg: string;
  afterImg: string;
};

