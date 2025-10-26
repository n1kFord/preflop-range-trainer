import { FC, useState, useMemo, useEffect } from "react";
import Chart from "./Chart";
import ChartSwitch from "./ChartSwitch";
import { usePersistentRanges } from "../../hooks/usePersistentCards";
import { formatRange } from "../../utils";
import cn from "classnames";

export type ActionType = "RFI" | "Call" | "3bet";
export type PositionType = "UTG" | "MP" | "CO" | "BTN" | "SB" | "BB";

type RFIRanges = { [H in PositionType]?: string };
type VsVillainRanges = {
    [H in PositionType]?: { [V in PositionType]?: string };
};

export type PracticeRangesNested = {
    RFI?: RFIRanges;
    Call?: VsVillainRanges;
    "3bet"?: VsVillainRanges;
};

interface ChartBoardProps {
    setTrainingActions: (ranges: PracticeRangesNested) => void;
}

const POSITIONS: PositionType[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
const ACTIONS: ActionType[] = ["RFI"];

const ACTION_LABELS: Record<ActionType, string> = {
    RFI: "Open (RFI) 🟦",
    Call: "Cold-Call (vs RFI) 🟩",
    "3bet": "3bet (vs RFI) 🟥",
};

const ChartBoard: FC<ChartBoardProps> = ({ setTrainingActions }) => {
    const [action, setAction] = useState<ActionType>("RFI");
    const [heroPosition, setHeroPosition] = useState<PositionType>("UTG");
    const [villainPosition, setVillainPosition] = useState<PositionType>("UTG");
    const [practiceActions, setPracticeActions] = useState<ActionType[]>([]);

    const { getCards, toggleActions, clearCards, getActionPercentage } =
        usePersistentRanges();

    const availableVillainPositions = useMemo(
        () => POSITIONS.filter((pos) => pos !== "BB"),
        [],
    );

    const availableHeroPositions = useMemo(() => {
        if (action === "Call" || action === "3bet") {
            const villainIndex = POSITIONS.indexOf(villainPosition);
            return POSITIONS.slice(villainIndex + 1);
        }
        if (action === "RFI") {
            return POSITIONS.filter((pos) => pos !== "BB");
        }
        return POSITIONS;
    }, [action, villainPosition]);

    useEffect(() => {
        if (!availableHeroPositions.includes(heroPosition)) {
            if (availableHeroPositions.length > 0) {
                setHeroPosition(availableHeroPositions[0]);
            }
        }
    }, [availableHeroPositions, heroPosition]);

    useEffect(() => {
        if (villainPosition === "BB") {
            setVillainPosition("UTG");
        }
    }, [villainPosition]);

    const cards = getCards(action, heroPosition, villainPosition);
    const actionPercentage = getActionPercentage(
        action,
        heroPosition,
        villainPosition,
    );

    const hasRange = (
        act: ActionType,
        hero: PositionType,
        villain?: PositionType,
    ) => formatRange(getCards(act, hero, villain), act).trim() !== "";

    const hasHandsForRFI = POSITIONS.some((hero) => hasRange("RFI", hero));
    console.log(hasHandsForRFI);

    const buildPracticeRanges = (): PracticeRangesNested => {
        const result: PracticeRangesNested = {};

        practiceActions.forEach((act) => {
            if (act === "RFI") {
                result.RFI ??= {};
                POSITIONS.forEach((heroPos) => {
                    const range = formatRange(
                        getCards(act, heroPos),
                        act,
                    ).trim();
                    if (range) result.RFI![heroPos] = range;
                });
            } else {
                result[act] ??= {};
                availableVillainPositions.forEach((villainPos) => {
                    POSITIONS.forEach((heroPos) => {
                        const range = formatRange(
                            getCards(act, heroPos, villainPos),
                            act,
                        ).trim();
                        if (range) {
                            (result[act] as VsVillainRanges)[heroPos] ??= {};
                            (result[act] as VsVillainRanges)[heroPos]![
                                villainPos
                            ] = range;
                        }
                    });
                });
            }
        });

        return result;
    };

    const togglePracticeAction = (act: ActionType) => {
        setPracticeActions((prev) => {
            let next = prev.includes(act)
                ? prev.filter((a) => a !== act)
                : [...prev, act];

            if (!next.includes("RFI")) {
                next = next.filter((a) => a === "RFI");
            }

            return next;
        });
    };

    const handleStartPractice = () => {
        const nestedRanges = buildPracticeRanges();
        if (Object.keys(nestedRanges).length) {
            setTrainingActions(nestedRanges);
        }
    };

    return (
        <section className="chart">
            <Chart
                cards={cards}
                actionPercentage={actionPercentage}
                toggleActions={(index, act) =>
                    toggleActions(
                        action,
                        heroPosition,
                        index,
                        act,
                        villainPosition,
                    )
                }
                clearCards={() =>
                    clearCards(action, heroPosition, villainPosition)
                }
                currentAction={action}
            />

            <div className="chart__actions">
                <div className="chart__actions__main">
                    <div className="chart__actions__select">
                        <label
                            htmlFor="action-select"
                            className="chart__actions__select__title"
                        >
                            Select Your Action
                        </label>
                        <select
                            id="action-select"
                            value={action}
                            className="chart__actions__select__input"
                            onChange={(e) => {
                                const newAction = e.target.value as ActionType;
                                setAction(newAction);
                                setVillainPosition("UTG");
                                setHeroPosition("UTG");
                            }}
                        >
                            {ACTIONS.map((act) => (
                                <option key={act} value={act}>
                                    {ACTION_LABELS[act]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="chart__actions__group">
                        {(action === "Call" || action === "3bet") && (
                            <div className="chart__actions__select villain">
                                <label className="chart__actions__select__title">
                                    Select Villain Position
                                </label>
                                <ChartSwitch
                                    items={availableVillainPositions.map(
                                        (pos) => ({
                                            value: pos,
                                            label: pos,
                                        }),
                                    )}
                                    value={villainPosition}
                                    onChange={(val: PositionType) =>
                                        setVillainPosition(val)
                                    }
                                />
                            </div>
                        )}

                        {availableHeroPositions.length > 0 &&
                            action === "RFI" && (
                                <div className="chart__actions__select">
                                    <label className="chart__actions__select__title">
                                        Select Hero Position
                                    </label>
                                    <ChartSwitch
                                        items={availableHeroPositions.map(
                                            (pos) => ({
                                                value: pos,
                                                label: pos,
                                            }),
                                        )}
                                        value={heroPosition}
                                        onChange={setHeroPosition}
                                    />
                                </div>
                            )}
                    </div>
                </div>

                <div className="chart__actions__separator"></div>

                <div className="chart__actions__practice">
                    <div className="chart__actions__select">
                        <label className="chart__actions__select__title">
                            Choose Actions to Practice
                        </label>
                        {/* <ul className="chart__actions__practice__items">
                            {ACTIONS.map((act) => {
                                const rfiHasHands = hasHandsForAction("RFI");
                                const rfiEnabled =
                                    practiceActions.includes("RFI");

                                const disabled =
                                    act === "RFI"
                                        ? !rfiHasHands
                                        : !rfiHasHands ||
                                          !rfiEnabled ||
                                          !hasHandsForAction(act);

                                return (
                                    <li key={act}>
                                        <label
                                            className={cn({ disabled })}
                                            title={
                                                disabled
                                                    ? act === "RFI"
                                                        ? "No ranges available for Open"
                                                        : !rfiHasHands
                                                          ? "No Open ranges defined, so this action is locked"
                                                          : !rfiEnabled
                                                            ? "Enable Open first"
                                                            : "No ranges available for this action"
                                                    : "Include this action in practice"
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={practiceActions.includes(
                                                    act,
                                                )}
                                                onChange={() =>
                                                    togglePracticeAction(act)
                                                }
                                                disabled={disabled}
                                            />
                                            {act}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul> */}

                        <ul className="chart__actions__practice__items">
                            <li key="RFI">
                                <label
                                    title={
                                        hasHandsForRFI
                                            ? "Include this action in practice"
                                            : "Please select at least one hand before starting."
                                    }
                                    className={cn({
                                        disabled: !hasHandsForRFI,
                                    })}
                                >
                                    <input
                                        type="checkbox"
                                        checked={practiceActions.includes(
                                            "RFI",
                                        )}
                                        disabled={!hasHandsForRFI}
                                        onChange={() =>
                                            togglePracticeAction("RFI")
                                        }
                                    />
                                    RFI
                                </label>
                            </li>

                            <li key="Call">
                                <label
                                    className="disabled"
                                    title="Coming soon..."
                                >
                                    <input type="checkbox" disabled />
                                    Call
                                </label>
                            </li>

                            <li key="3bet">
                                <label
                                    className="disabled"
                                    title="Coming soon..."
                                >
                                    <input type="checkbox" disabled />
                                    3bet
                                </label>
                            </li>
                        </ul>

                        <button
                            type="button"
                            className="chart__actions__practice__btn"
                            onClick={handleStartPractice}
                            disabled={practiceActions.length === 0}
                            title={
                                practiceActions.length === 0
                                    ? "Select at least one action to start"
                                    : "Start practicing"
                            }
                        >
                            Start Practicing
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChartBoard;
