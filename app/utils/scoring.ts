import { Confluence } from "../types";

export type ConfluenceSelection = Record<string, boolean>;

export function calculateScore(selection: ConfluenceSelection, list: Confluence[]) {
  return list.reduce(
    (acc, conf) => {
      if (selection[conf.id]) {
        acc.total += conf.weight;
        acc.activeIds.push(conf.id);
      }
      return acc;
    },
    { total: 0, activeIds: [] as string[] },
  );
}

export function describeLevel(total: number) {
  if (total === 0) return { level: "No confluence", caption: "No confluences marked – stay out.", badgeClass: "low" };
  if (total <= 40) return { level: "Low confluence", caption: "Weak setup. Probably skip.", badgeClass: "low" };
  if (total <= 80) return { level: "Medium confluence", caption: "Decent setup, but not A+.", badgeClass: "medium" };
  if (total <= 100) return { level: "High confluence", caption: "Strong setup. Trade only if risk makes sense.", badgeClass: "high" };
  return { level: "A+ setup", caption: "Very rare, high conviction setup.", badgeClass: "aplus" };
}

