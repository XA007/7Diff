import {LeaderBoard} from "./gameAssets/LeaderBoard";

export interface GameCard {
  name: string;
  imageUrl: string;
  soloMode: LeaderBoard[];
  multiPlayer: LeaderBoard[];
  multiPlayerButtonName: string;
}
