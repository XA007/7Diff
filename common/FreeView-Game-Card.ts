import {LeaderBoard} from "./gameAssets/LeaderBoard";
import {Modifications} from "./Modifications";

export interface GameCard {
    name: string;
    imageUrl: string;
    modifications: Modifications;
    originalObjects: any[];
    soloMode: LeaderBoard[];
    multiPlayer: LeaderBoard[];
}
