import twoOfHearts from "./2_of_hearts.png";
import threeOfHearts from "./3_of_hearts.png";
import fourOfHearts from "./4_of_hearts.png";
import fiveOfHearts from "./5_of_hearts.png";
import sixOfHearts from "./6_of_hearts.png";
import sevenOfHearts from "./7_of_hearts.png";
import eightOfHearts from "./8_of_hearts.png";
import nineOfHearts from "./9_of_hearts.png";
import tenOfHearts from "./10_of_hearts.png";
import jackOfHearts from "./jack_of_hearts.png";
import queenOfHearts from "./queen_of_hearts.png";
import kingOfHearts from "./king_of_hearts.png";
import aceOfHearts from "./ace_of_hearts.png";

import twoOfDiamonds from "./2_of_diamonds.png";
import threeOfDiamonds from "./3_of_diamonds.png";
import fourOfDiamonds from "./4_of_diamonds.png";
import fiveOfDiamonds from "./5_of_diamonds.png";
import sixOfDiamonds from "./6_of_diamonds.png";
import sevenOfDiamonds from "./7_of_diamonds.png";
import eightOfDiamonds from "./8_of_diamonds.png";
import nineOfDiamonds from "./9_of_diamonds.png";
import tenOfDiamonds from "./10_of_diamonds.png";
import jackOfDiamonds from "./jack_of_diamonds.png";
import queenOfDiamonds from "./queen_of_diamonds.png";
import kingOfDiamonds from "./king_of_diamonds.png";
import aceOfDiamonds from "./ace_of_diamonds.png";

import twoOfClubs from "./2_of_clubs.png";
import threeOfClubs from "./3_of_clubs.png";
import fourOfClubs from "./4_of_clubs.png";
import fiveOfClubs from "./5_of_clubs.png";
import sixOfClubs from "./6_of_clubs.png";
import sevenOfClubs from "./7_of_clubs.png";
import eightOfClubs from "./8_of_clubs.png";
import nineOfClubs from "./9_of_clubs.png";
import tenOfClubs from "./10_of_clubs.png";
import jackOfClubs from "./jack_of_clubs.png";
import queenOfClubs from "./queen_of_clubs.png";
import kingOfClubs from "./king_of_clubs.png";
import aceOfClubs from "./ace_of_clubs.png";

import twoOfSpades from "./2_of_spades.png";
import threeOfSpades from "./3_of_spades.png";
import fourOfSpades from "./4_of_spades.png";
import fiveOfSpades from "./5_of_spades.png";
import sixOfSpades from "./6_of_spades.png";
import sevenOfSpades from "./7_of_spades.png";
import eightOfSpades from "./8_of_spades.png";
import nineOfSpades from "./9_of_spades.png";
import tenOfSpades from "./10_of_spades.png";
import jackOfSpades from "./jack_of_spades.png";
import queenOfSpades from "./queen_of_spades.png";
import kingOfSpades from "./king_of_spades.png";
import aceOfSpades from "./ace_of_spades.png";

const allCards = [
    twoOfHearts,
    threeOfHearts,
    fourOfHearts,
    fiveOfHearts,
    sixOfHearts,
    sevenOfHearts,
    eightOfHearts,
    nineOfHearts,
    tenOfHearts,
    jackOfHearts,
    queenOfHearts,
    kingOfHearts,
    aceOfHearts,
    twoOfDiamonds,
    threeOfDiamonds,
    fourOfDiamonds,
    fiveOfDiamonds,
    sixOfDiamonds,
    sevenOfDiamonds,
    eightOfDiamonds,
    nineOfDiamonds,
    tenOfDiamonds,
    jackOfDiamonds,
    queenOfDiamonds,
    kingOfDiamonds,
    aceOfDiamonds,
    twoOfClubs,
    threeOfClubs,
    fourOfClubs,
    fiveOfClubs,
    sixOfClubs,
    sevenOfClubs,
    eightOfClubs,
    nineOfClubs,
    tenOfClubs,
    jackOfClubs,
    queenOfClubs,
    kingOfClubs,
    aceOfClubs,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
    fiveOfSpades,
    sixOfSpades,
    sevenOfSpades,
    eightOfSpades,
    nineOfSpades,
    tenOfSpades,
    jackOfSpades,
    queenOfSpades,
    kingOfSpades,
    aceOfSpades,
];

type Suit = "h" | "d" | "c" | "s";
type Rank =
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "T"
    | "J"
    | "Q"
    | "K"
    | "A";

export interface Combo {
    comboName?: string;
    path?: string[];
}

const rankMap: Record<string, Rank> = {
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "T",
    jack: "J",
    queen: "Q",
    king: "K",
    ace: "A",
};

const suitMap: Record<string, Suit> = {
    hearts: "h",
    diamonds: "d",
    clubs: "c",
    spades: "s",
};

function parseCardPath(path: string): { rank: Rank; suit: Suit } {
    const fileName = path.split("/").pop()!.replace(".png", "");
    const rankKey = Object.keys(rankMap).find((k) => fileName.startsWith(k))!;
    const suitKey = Object.keys(suitMap).find((k) => fileName.includes(k))!;
    return {
        rank: rankMap[rankKey],
        suit: suitMap[suitKey],
    };
}

export function getRandomCombo(arr: string[] = allCards, count = 2): Combo {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const selected = copy.slice(0, count);

    const [c1, c2] = selected.map(parseCardPath);

    let comboName = "";
    if (c1.rank === c2.rank) {
        comboName = c1.rank + c2.rank;
    } else {
        const ranks: Rank[] = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "T",
            "J",
            "Q",
            "K",
            "A",
        ];
        const sorted = [c1, c2].sort(
            (a, b) => ranks.indexOf(b.rank) - ranks.indexOf(a.rank),
        );
        const suited = sorted[0].suit === sorted[1].suit ? "s" : "o";
        comboName = sorted[0].rank + sorted[1].rank + suited;
    }

    return {
        comboName,
        path: selected,
    };
}
