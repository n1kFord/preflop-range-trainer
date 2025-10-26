import React, { FC, useRef, useCallback, useState, useEffect } from "react";
import cn from "classnames";
import { IChartCard } from "../../utils/data";
import { ActionType } from "./ChartBoard";
import { formatRange, parseRangeString } from "../../utils";

interface ChartProps {
    cards: IChartCard[];
    toggleActions: (index: number, action: ActionType) => void;
    clearCards: () => void;
    actionPercentage: string;
    currentAction: ActionType;
}

interface CardButtonProps {
    card: IChartCard;
    index: number;
    currentAction: ActionType;
    toggleActions: (index: number, action: ActionType) => void;
    handleKeyDown: (
        e: React.KeyboardEvent<HTMLButtonElement>,
        index: number,
    ) => void;
    setButtonRef: (index: number, el: HTMLButtonElement | null) => void;
}

const CardButton: FC<CardButtonProps> = React.memo(
    ({
        card,
        index,
        currentAction,
        toggleActions,
        handleKeyDown,
        setButtonRef,
    }) => {
        const itemClass = cn("chart__table__item", {
            rfi: card.actions.includes("RFI"),
            threebet: card.actions.includes("3bet"),
            call: card.actions.includes("Call"),
            active: card.actions.length !== 0,
        });

        return (
            <button
                ref={(el) => setButtonRef(index, el)}
                className={itemClass}
                type="button"
                onClick={() => toggleActions(index, currentAction)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={0}
                key={card.value}
            >
                {card.value}
            </button>
        );
    },
);

const Chart: FC<ChartProps> = ({
    cards,
    currentAction,
    toggleActions,
    clearCards,
    actionPercentage,
}) => {
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
            if (e.currentTarget !== document.activeElement) return;

            let newIndex = index;
            const rowSize = 13;

            switch (e.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    if (index - rowSize >= 0) newIndex = index - rowSize;
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    if (index + rowSize < cards.length)
                        newIndex = index + rowSize;
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    if (index % rowSize !== 0) newIndex = index - 1;
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    if ((index + 1) % rowSize !== 0) newIndex = index + 1;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            buttonsRef.current[newIndex]?.focus();
        },
        [cards.length],
    );

    const setButtonRef = useCallback(
        (index: number, el: HTMLButtonElement | null) => {
            buttonsRef.current[index] = el;
        },
        [],
    );

    const [rangeInput, setRangeInput] = useState("");

    useEffect(() => {
        const formatted = formatRange(cards, currentAction);
        setRangeInput(formatted);
    }, [cards, currentAction]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeInput(e.target.value);
    };

    const applyRangeChange = () => {
        const parsed = parseRangeString(rangeInput);
        cards.forEach((card, index) => {
            const isSelected = parsed.includes(card.value);
            const hasAction = card.actions.includes(currentAction);

            if (isSelected && !hasAction) toggleActions(index, currentAction);
            if (!isSelected && hasAction) toggleActions(index, currentAction);
        });
    };

    const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") applyRangeChange();
    };

    return (
        <div className="chart__main">
            <div className="chart__table">
                {cards.map((card, index) => (
                    <CardButton
                        key={card.value}
                        card={card}
                        index={index}
                        currentAction={currentAction}
                        toggleActions={toggleActions}
                        handleKeyDown={handleKeyDown}
                        setButtonRef={setButtonRef}
                    />
                ))}
            </div>

            <div className="chart__table__bottom">
                <button
                    type="button"
                    className="chart__table__clear"
                    onClick={clearCards}
                >
                    Clear
                </button>
                <input
                    type="text"
                    name="chart-insert"
                    className="chart__table__insert"
                    value={rangeInput}
                    onChange={handleInputChange}
                    onBlur={applyRangeChange}
                    onKeyDown={handleKeyDownInput}
                    placeholder="AA, AKs, A5s-A2s, KQo..."
                />
                <span className="chart__table__percentage">
                    {actionPercentage}%
                </span>
            </div>
        </div>
    );
};

export default Chart;
