import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import closeIconPath from "../../assets/close.svg";
import { CHART_MODAL_CARDS } from "../../utils/data";
import { PositionType } from "../ChartBoard/ChartBoard";

export interface IModalAction {
    position: PositionType;
    cards: string[];
    type: "fold" | "rfi";
    errorCard: string;
}

interface GameChartModalProps {
    onClose: () => void;
    modalAction: null | IModalAction;
    onNext: () => void;
    onRetry: () => void;
}

const GameChartModal: FC<GameChartModalProps> = ({
    onClose,
    modalAction,
    onNext,
    onRetry,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState<null | IModalAction>(null);
    const [isActionDisabled, setIsActionDisabled] = useState(false);

    // handle open/close
    useEffect(() => {
        if (modalAction) {
            setContent(modalAction);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsActionDisabled(false);
            setIsVisible(false);
        }
    }, [modalAction]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // when fade-out animation ends, clear content
    const handleTransitionEnd = () => {
        if (!isVisible) setContent(null);
    };

    const actionLock = React.useRef(false);

    const handleClick = (callback: () => void) => {
        if (actionLock.current || isActionDisabled) return;
        actionLock.current = true;
        setIsActionDisabled(true);
        callback();
        setTimeout(() => {
            actionLock.current = false;
        }, 500);
    };

    const handleOverlayClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        if (event.target === event.currentTarget) onClose();
    };

    if (!content) return null;

    return (
        <div
            className={cn("gameboard__modal", { visible: isVisible })}
            onClick={handleOverlayClick}
            onTransitionEnd={handleTransitionEnd}
        >
            <div
                className="gameboard__modal__container"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="gameboard__modal__close"
                    onClick={onClose}
                >
                    <img
                        src={closeIconPath}
                        alt="close modal"
                        width={43}
                        height={40}
                    />
                </button>

                <h1 className="gameboard__modal__title">
                    {content.type === "fold" ? "In range" : "Out of Range"} (
                    <span>{content.position}</span>)
                </h1>

                <div className="gameboard__modal__table">
                    {CHART_MODAL_CARDS.map((card) => {
                        const cardClass = cn("gameboard__modal__table__item", {
                            active: content.cards.includes(card.value),
                            error: card.value === content.errorCard,
                        });
                        return (
                            <span className={cardClass} key={card.value}>
                                {card.value}
                            </span>
                        );
                    })}
                </div>

                <div className="gameboard__modal__actions">
                    <button
                        type="button"
                        className="gameboard__modal__btn"
                        onClick={() => handleClick(onRetry)}
                        disabled={isActionDisabled}
                    >
                        Retry
                    </button>
                    <button
                        type="button"
                        className="gameboard__modal__btn"
                        onClick={() => handleClick(onNext)}
                        disabled={isActionDisabled}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameChartModal;
