import betSoundFile from "./blind-bet.mp3";
import dealerSoundFile from "./dealer.mp3";
import cardsSoundFile from "./cards.mp3";
import foldSoundFile from "./fold.mp3";
import checkSoundFile from "./check.mp3";

const betSound = new Audio(betSoundFile);
const dealerSound = new Audio(dealerSoundFile);
const cardsSound = new Audio(cardsSoundFile);
const foldSound = new Audio(foldSoundFile);
const checkSound = new Audio(checkSoundFile);

const sounds = {
    dealer: dealerSound,
    bet: betSound,
    showCards: cardsSound,
    fold: foldSound,
    check: checkSound,
};

export type SoundType = keyof typeof sounds;

export const playSound = (sound: SoundType, volume = 0.02): void => {
    const base = sounds[sound];
    const cloned = base.cloneNode(true) as HTMLAudioElement;
    cloned.volume = volume;
    cloned.play();
};
