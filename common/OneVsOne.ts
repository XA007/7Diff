import {Player} from "./Player";
import {LeaderBoard} from "./LeaderBoard";

export interface OneVsOne {
     gameName: string;
     player: Player;
     opponent: Player;
     eventsLog: string[];
     timer: string;
     leaderBoard: LeaderBoard[];
 }
