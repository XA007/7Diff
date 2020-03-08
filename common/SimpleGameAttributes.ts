import {LeaderBoard} from "./gameAssets/LeaderBoard";

export interface SimpleGameAttributes {
    userName: string;
    gameName: string;
    eventsLog: string[];
    chronoValue: string;
    soloMode: LeaderBoard[];
}
