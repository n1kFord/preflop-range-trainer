import React, { FC, useState, useEffect } from "react";
import { PositionType, PracticeRangesNested } from "../ChartBoard/ChartBoard";
import pathToCardBack from "../../assets/card-back.svg";
import { playSound } from "../../assets/sounds";
import cn from "classnames";
import { Combo, getRandomCombo } from "../../assets/cards";
import GameChartModal, { IModalAction } from "./GameChartModal";

interface GameBoardProps {
    trainingRanges: PracticeRangesNested;
    setIsPracticeMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Player {
    id: number;
    name: string;
    isActive: boolean;
    bet: number | null;
    isFold: boolean;
    position: null | PositionType;
}

const initialPlayers: Player[] = [
    {
        id: 1,
        name: "player1",
        isActive: false,
        bet: null,
        isFold: false,
        position: null,
    },
    {
        id: 2,
        name: "player2",
        isActive: false,
        bet: null,
        isFold: false,
        position: null,
    },
    {
        id: 3,
        name: "player3",
        isActive: false,
        bet: null,
        isFold: false,
        position: null,
    },
    {
        id: 4,
        name: "player4",
        isActive: false,
        bet: null,
        isFold: false,
        position: null,
    },
    {
        id: 5,
        name: "player5",
        isActive: true,
        bet: null,
        isFold: false,
        position: null,
    }, // our seat (index 4)
    {
        id: 6,
        name: "player6",
        isActive: false,
        bet: null,
        isFold: false,
        position: null,
    },
];

const GameBoard: FC<GameBoardProps> = ({
    trainingRanges,
    setIsPracticeMode,
}) => {
    const [currentCards, setCurrentCards] = useState<Combo>();
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [dealerId, setDealerId] = useState<number | null>(null);
    const [showDealer, setShowDealer] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [currentTurn, setCurrentTurn] = useState<number | null>(null);
    const [currentBank, setCurrentBank] = useState<number>(0);
    const [ourTurn, setOurTurn] = useState(false);
    const [previousBetState, setPreviousBetState] = useState<number | null>(
        null,
    );
    const [previousBankState, setPreviousBankState] = useState<number>(0);
    const [isActionDisabled, setIsActionDisabled] = useState(false);

    const [modalAction, setModalAction] = useState<null | IModalAction>(null);

    const makeMove = ({
        typeOfMove,
        playerId,
        betValue,
    }: {
        typeOfMove: "bet" | "fold" | "check";
        playerId: number;
        betValue?: number;
    }) => {
        if (typeOfMove === "bet" && betValue) {
            playSound("bet");
            setPlayers((prev) =>
                prev.map((p) =>
                    p.id === playerId
                        ? { ...p, bet: p.bet ? betValue + p.bet : betValue }
                        : p,
                ),
            );
            setCurrentBank((prev) => prev + betValue);
        } else if (typeOfMove === "fold") {
            playSound("fold");
            setPlayers((prev) =>
                prev.map((p) =>
                    p.id === playerId ? { ...p, isFold: true } : p,
                ),
            );
        } else {
            playSound("check");
        }
    };

    const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const nextTurn = async (startIndex: number) => {
        let i = startIndex;
        while (true) {
            const player = players[i];
            if (player.isActive) {
                await wait(400);
                // stop on our turn
                setCurrentTurn(player.id);
                setOurTurn(true);
                playSound("showCards");
                setShowCards(true);
                break;
            } else {
                // others auto fold
                await wait(400);
                setCurrentTurn(player.id);
                makeMove({ typeOfMove: "fold", playerId: player.id });
                i = (i + 1) % players.length;
            }
        }
    };

    const dealHand = async () => {
        // reset game state before dealing
        setShowDealer(false);
        setShowCards(false);
        setOurTurn(false);
        setCurrentTurn(null);
        setCurrentBank(0);
        setIsActionDisabled(false);

        // reset all players
        let newPlayers: Player[] = initialPlayers.map((p) => ({
            ...p,
            bet: null,
            isFold: false,
            position: null,
        }));

        // position order relative to the dealer
        const positions: PositionType[] = [
            "BTN",
            "SB",
            "BB",
            "UTG",
            "MP",
            "CO",
        ];

        // positions that are available in user's selected training ranges
        const availablePositions = Object.keys(
            trainingRanges?.RFI || {},
        ) as PositionType[];

        // our seat index (player5)
        const ourSeatIndex = 4;

        // build a list of all dealer indices that give our seat an allowed position
        const validDealerIndices = newPlayers
            .map((_, dealerIndex) => {
                const rel =
                    (ourSeatIndex - dealerIndex + newPlayers.length) %
                    newPlayers.length;
                return { dealerIndex, ourPos: positions[rel] };
            })
            .filter(
                ({ ourPos }) =>
                    availablePositions.length === 0 ||
                    availablePositions.includes(ourPos),
            )
            .map(({ dealerIndex }) => dealerIndex);

        // pick random dealer from valid ones or fallback to any
        const dealerIndex = validDealerIndices.length
            ? validDealerIndices[
                  Math.floor(Math.random() * validDealerIndices.length)
              ]
            : Math.floor(Math.random() * newPlayers.length);

        const smallBlindIndex = (dealerIndex + 1) % newPlayers.length;
        const bigBlindIndex = (dealerIndex + 2) % newPlayers.length;

        // avoid making our seat the big blind — shift dealer if needed
        const adjustedDealerIndex =
            bigBlindIndex === ourSeatIndex
                ? (dealerIndex + 1) % newPlayers.length
                : dealerIndex;

        // assign positions relative to dealer
        newPlayers = newPlayers.map((p, i) => {
            const rel =
                (i - adjustedDealerIndex + newPlayers.length) %
                newPlayers.length;
            return { ...p, position: positions[rel] };
        });

        setPlayers(newPlayers);
        setDealerId(newPlayers[adjustedDealerIndex].id);

        // show dealer chip
        await wait(500);
        setShowDealer(true);
        setCurrentTurn(newPlayers[adjustedDealerIndex].id);
        playSound("dealer");

        // small blind bet
        await wait(550);
        makeMove({
            typeOfMove: "bet",
            playerId: newPlayers[(adjustedDealerIndex + 1) % 6].id,
            betValue: 0.5,
        });
        setCurrentTurn(newPlayers[smallBlindIndex].id);

        // big blind bet
        await wait(550);
        makeMove({
            typeOfMove: "bet",
            playerId: newPlayers[(adjustedDealerIndex + 2) % 6].id,
            betValue: 1,
        });

        setCurrentTurn(newPlayers[bigBlindIndex].id);

        // deal our cards
        const cards = getRandomCombo();
        setCurrentCards(cards);

        // next active position (UTG)
        const utgIndex = (adjustedDealerIndex + 3) % newPlayers.length;
        nextTurn(utgIndex);
    };

    const handleAction = async (
        moveType: "fold" | "bet",
        betValue?: number,
    ) => {
        makeMove({ typeOfMove: moveType, playerId: 5, betValue });
        if (moveType === "fold") {
            setShowCards(false);
        }

        if (moveType === "bet") {
            setIsActionDisabled(true);
            const currentBet = players.find((p) => p.id === 5)?.bet ?? null;
            setPreviousBetState(currentBet);
            setPreviousBankState(currentBank);
        }

        await wait(550);

        const ourPosition = players[4].position as PositionType;
        const trainingPositionCards =
            trainingRanges["RFI"]?.[ourPosition]
                ?.split(",")
                .map((s) => s.trim()) ?? [];
        const ourCards = currentCards?.comboName as string;

        const isCorrect =
            moveType === "fold"
                ? !trainingPositionCards.includes(ourCards)
                : trainingPositionCards.includes(ourCards);

        if (!isCorrect) {
            setModalAction({
                position: ourPosition,
                cards: trainingPositionCards as string[],
                type: moveType === "fold" ? "fold" : "rfi",
                errorCard: ourCards,
            });
        } else {
            await wait(550);
            dealHand();
        }
    };

    const hasDealtRef = React.useRef(false);
    useEffect(() => {
        if (!hasDealtRef.current) {
            dealHand();
            hasDealtRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="gameboard">
            <div className="gameboard__menu">
                <button
                    type="button"
                    onClick={() => setIsPracticeMode(false)}
                    className="gameboard__menu__back"
                >
                    Go Back
                </button>
            </div>
            <div className="gameboard__table">
                <p className="gameboard__table__bank">
                    Bank: <b>{currentBank}bb</b>
                </p>
                <div className="gameboard__table__container">
                    {players.map((player) => {
                        const seatClass = cn("gameboard__seat", {
                            active: player.isActive,
                            turn: player.id === currentTurn,
                            fold: player.isFold,
                        });
                        return (
                            <div key={player.id} className={seatClass}>
                                <div className="gameboard__seat__cards">
                                    {player.isActive &&
                                    currentCards?.path &&
                                    ourTurn &&
                                    showCards ? (
                                        <>
                                            <img
                                                src={currentCards.path[0]}
                                                alt=""
                                            />
                                            <img
                                                src={currentCards.path[1]}
                                                alt=""
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <img src={pathToCardBack} alt="" />
                                            <img src={pathToCardBack} alt="" />
                                        </>
                                    )}
                                </div>
                                <div className="gameboard__seat__info">
                                    {player.id === 2 ||
                                    player.id === 3 ||
                                    player.id === 4 ? (
                                        <>
                                            <div></div>
                                            <span>{player.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{player.name}</span>
                                            <div></div>
                                        </>
                                    )}
                                </div>
                                <div className="gameboard__seat__actions">
                                    {dealerId === player.id && showDealer && (
                                        <div className="gameboard__seat__actions__button">
                                            D
                                        </div>
                                    )}
                                    {player.bet && (
                                        <span className="gameboard__seat__actions__bet">
                                            {player.bet} BB
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showCards && (
                <div className="gameboard__actions">
                    <div className="gameboard__actions__header">
                        <p className="gameboard__actions__message">
                            Should you <b>open</b> with this hand?{" "}
                            <span>({currentCards?.comboName})</span>
                        </p>
                    </div>
                    <div className="gameboard__actions__container">
                        <button
                            type="button"
                            className="gameboard__actions__button fold"
                            onClick={() => handleAction("fold")}
                            disabled={isActionDisabled}
                        >
                            Fold
                        </button>

                        <button
                            type="button"
                            className="gameboard__actions__button open"
                            onClick={() => handleAction("bet", 2.5)}
                            disabled={isActionDisabled}
                        >
                            Raise (2.5BB)
                        </button>
                    </div>
                </div>
            )}

            <GameChartModal
                modalAction={modalAction}
                onClose={() => {
                    setIsPracticeMode(false);
                    setModalAction(null);
                }}
                onNext={() => {
                    dealHand();
                    setModalAction(null);
                }}
                onRetry={() => {
                    setModalAction(null);
                    if (!showCards) setShowCards(true);

                    setIsActionDisabled(false);

                    setPlayers((prev) =>
                        prev.map((p) =>
                            p.id === 5
                                ? { ...p, bet: previousBetState, isFold: false }
                                : p,
                        ),
                    );
                    setCurrentBank(previousBankState);
                }}
            />
        </section>
    );
};

export default GameBoard;
