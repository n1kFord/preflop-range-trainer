import { useEffect, useState, useCallback } from "react";
import { CHART_CARDS, IChartCard, getComboCount } from "../utils/data";
import { ActionType, PositionType } from "../components/ChartBoard/ChartBoard";

type RangeStorage = {
    [A in ActionType]: {
        [V in PositionType | "ALL"]?: {
            [H in PositionType]?: IChartCard[];
        };
    };
};

function loadAllRanges(): RangeStorage {
    try {
        return JSON.parse(
            localStorage.getItem("ranges") || "{}",
        ) as RangeStorage;
    } catch {
        return {} as RangeStorage;
    }
}

export function usePersistentRanges() {
    const [ranges, setRanges] = useState<RangeStorage>(() => loadAllRanges());

    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem("ranges", JSON.stringify(ranges));
        }, 300);
        return () => clearTimeout(handler);
    }, [ranges]);

    const getVillainKey = (action: ActionType, villain?: PositionType) =>
        action === "RFI" ? "ALL" : (villain as PositionType);

    const getCards = useCallback(
        (action: ActionType, hero: PositionType, villain?: PositionType) => {
            const vKey = getVillainKey(action, villain);
            return ranges?.[action]?.[vKey]?.[hero] ?? CHART_CARDS;
        },
        [ranges],
    );

    const setCards = useCallback(
        (
            action: ActionType,
            hero: PositionType,
            cards: IChartCard[],
            villain?: PositionType,
        ) => {
            const vKey = getVillainKey(action, villain);
            setRanges((prev) => ({
                ...prev,
                [action]: {
                    ...prev[action],
                    [vKey]: {
                        ...prev[action]?.[vKey],
                        [hero]: cards,
                    },
                },
            }));
        },
        [],
    );

    const toggleActions = useCallback(
        (
            action: ActionType,
            hero: PositionType,
            index: number,
            act: ActionType,
            villain?: PositionType,
        ) => {
            const vKey = getVillainKey(action, villain);
            setRanges((prev) => {
                const cards = prev[action]?.[vKey]?.[hero] ?? CHART_CARDS;
                const updatedCard = { ...cards[index] };
                updatedCard.actions = updatedCard.actions.includes(act)
                    ? updatedCard.actions.filter((a) => a !== act)
                    : [...updatedCard.actions, act];

                const updatedCards = [...cards];
                updatedCards[index] = updatedCard;

                return {
                    ...prev,
                    [action]: {
                        ...prev[action],
                        [vKey]: {
                            ...prev[action]?.[vKey],
                            [hero]: updatedCards,
                        },
                    },
                };
            });
        },
        [],
    );

    const clearCards = useCallback(
        (action: ActionType, hero: PositionType, villain?: PositionType) => {
            setCards(action, hero, CHART_CARDS, villain);
        },
        [setCards],
    );

    const getActionPercentage = useCallback(
        (action: ActionType, hero: PositionType, villain?: PositionType) => {
            const cards = getCards(action, hero, villain);
            const totalCombos = 1326;
            const selectedCombos = cards.reduce(
                (sum, card) =>
                    sum + (card.actions.length ? getComboCount(card.value) : 0),
                0,
            );
            return ((selectedCombos / totalCombos) * 100).toFixed(2);
        },
        [getCards],
    );

    return {
        ranges,
        getCards,
        setCards,
        toggleActions,
        clearCards,
        getActionPercentage,
    };
}
