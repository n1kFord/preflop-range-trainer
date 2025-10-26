import React, { FC, useState } from "react";
import ChartBoard, { PracticeRangesNested } from "../ChartBoard/ChartBoard";
import GameBoard from "../GameBoard/GameBoard";

const App: FC = () => {
    const [trainingRanges, setTrainingRanges] = useState<PracticeRangesNested>(
        {},
    );

    const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

    return (
        <main className="main">
            {!isPracticeMode && (
                <ChartBoard
                    setTrainingActions={(ranges) => {
                        setTrainingRanges(ranges);
                        setIsPracticeMode(true);
                    }}
                />
            )}

            {isPracticeMode && (
                <GameBoard
                    trainingRanges={trainingRanges}
                    setIsPracticeMode={setIsPracticeMode}
                />
            )}
        </main>
    );
};

export default App;
