import { IChartCard } from "./data";
import { ActionType } from "../components/ChartBoard/ChartBoard";
import prange from "prange";

export function formatRange(cards: IChartCard[], action: ActionType): string {
    return cards
        .filter((card) => card.actions.includes(action))
        .map((card) => card.value)
        .join(", ");
}

export function parseRangeString(rangeStr: string): string[] {
    try {
        const combos = prange(rangeStr);
        return combos;
    } catch (err) {
        console.error("parseRangeString error:", err);
        return [];
    }
}
