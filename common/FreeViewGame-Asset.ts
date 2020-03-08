import {GameCard} from "./Game-Card";

export interface FreeViewGameAsset {
    gameCard: GameCard;
    originalObjects: string;
    modifications: string[];
    modifiedObjects: string;
}
