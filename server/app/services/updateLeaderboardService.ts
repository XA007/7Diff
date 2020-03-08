import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {Db} from "mongodb";
import {MONGODB_URI} from "../../../client/src/services/constants/Connections";
import {FreeViewGameAsset} from "../../../common/FreeViewGame-Asset";
import {GameAsset} from "../../../common/Game-Asset";
import {GameCard} from "../../../common/Game-Card";
import {LeaderBoard} from "../../../common/gameAssets/LeaderBoard";

const mongo: Function = require("mongojs");

export module UpdateLeaderboardRoute {

    @injectable()
    export class UpdateLeaderboardService {

        public constructor() {
            this.db = mongo(MONGODB_URI);
        }
        private db: Db;

        public static takePlaceInLeaderBoard(lettingPlace: LeaderBoard, takingPlaceTime: string, takingPlaceUsername: string): void {
            lettingPlace.time = takingPlaceTime;
            lettingPlace.username = takingPlaceUsername;
        }

        public async updateLeaderBoard(req: Request, res: Response, next: NextFunction, isSimpleGame: boolean): Promise<void> {

            const gameName: string = req.body.gameName;
            const userName: string = req.body.userName;
            const timestamp: string  = req.body.timestamp;
            const isMultiPlayer: boolean  = req.body.multiPlayer;

            let promise: Promise<string>;
            (isSimpleGame) ? promise = this.updateSimpleGameLeaderboard(gameName, userName, timestamp, isMultiPlayer)
               : promise = this.updateFreeGameLeaderboard(gameName, userName, timestamp, isMultiPlayer);

            return new Promise((resolve: Function) => {
                promise.then((result: string) => {
                    resolve(result);
                });
            }).then((value: string) => {
                res.send(value);
            });
        }

        public updateSimpleGameLeaderboard(gameName: string, userName: string, timestamp: string, isMultiPlayer: boolean): Promise<string> {
            const gameAsset: Promise<GameAsset> = new Promise( (resolve: Function) => {
                this.db.collection("simpleViewGames").find({"gameCard.name": gameName}).toArray((err: Error, res: GameAsset[]) => {
                    if (err) {throw err; }
                    resolve(res[0]);
                });
            });

            return new Promise((resolve: Function) => {
                gameAsset.then((game: GameAsset) => {
                    if (isMultiPlayer) {
                        const position: string = this.rearrangeLeaderboardMulti(game.gameCard, timestamp, userName);
                        if (position !== "0") {
                            this.db.collection("simpleViewGames").update({"gameCard.name": gameName},
                                                                         {$set: {"gameCard.multiPlayer": game.gameCard.multiPlayer, }});
                        }
                        resolve(position);
                    } else {
                        const position: string = this.rearrangeLeaderboard(game.gameCard, timestamp, userName);
                        if (position !== "0") {
                            this.db.collection("simpleViewGames").update({"gameCard.name": gameName},
                                                                         {$set: {"gameCard.soloMode": game.gameCard.soloMode, }});
                        }
                        resolve(position);
                    }
                });
            });
        }

        public updateFreeGameLeaderboard(gameName: string, userName: string, timestamp: string, isMultiPlayer: boolean): Promise<string> {
            const gameAsset: Promise<FreeViewGameAsset> = new Promise( (resolve: Function) => {
                this.db.collection("freeViewGames").find({"gameCard.name": gameName}).toArray((err: Error, game: FreeViewGameAsset[]) => {
                    if (err) {throw err; }
                    resolve(game[0]);
                });
            });

            return new Promise((resolve: Function) => {
            gameAsset.then((game: FreeViewGameAsset) => {
                if (isMultiPlayer) {
                    const position: string = this.rearrangeLeaderboardMulti(game.gameCard, timestamp, userName);
                    if (position !== "0") {
                        this.db.collection("freeViewGames").update({"gameCard.name": gameName},
                                                                   {$set: {"gameCard.multiPlayer": game.gameCard.multiPlayer, }});
                    }
                    resolve(position);
                } else {
                    const position: string = this.rearrangeLeaderboard(game.gameCard, timestamp, userName);
                    if (position !== "0") {
                        this.db.collection("freeViewGames").update({"gameCard.name": gameName},
                                                                   {$set: {"gameCard.soloMode": game.gameCard.soloMode, }});
                    }
                    resolve(position);
                }

                },
            );
        });
        }

        public compareTimestamps(newTime: string, oldTime: string): boolean {
            const MINUTES_SECONDS_LENGTH: number = 2;
            const SECONDS_OFFSET: number = 5;
            for (let i: number = 0; i < MINUTES_SECONDS_LENGTH; i++) {
                if (Number(newTime.charAt(i)) !== Number(oldTime.charAt(i))) {
                    return (Number(newTime.charAt(i)) < Number(oldTime.charAt(i)));
                }
            }

            for (let i: number = SECONDS_OFFSET; i < MINUTES_SECONDS_LENGTH + SECONDS_OFFSET; i++) {
                if (Number(newTime.charAt(i)) !== Number(oldTime.charAt(i))) {
                    return (Number(newTime.charAt(i)) < Number(oldTime.charAt(i)));
                }
            }

            return false;
        }

        public rearrangeLeaderboard(game: GameCard, timestamp: string, userName: string): string {
            const ZERO: number = 0;
            const ONE: number = 1;
            const TWO: number = 2;
            let position: string = "0";
            if (this.compareTimestamps(timestamp, game.soloMode[ZERO].time)) {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[TWO], game.soloMode[ONE].time, game.soloMode[ONE].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[ONE], game.soloMode[ZERO].time, game.soloMode[ZERO].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[ZERO], timestamp, userName);
                position = "1";
            } else if (this.compareTimestamps(timestamp, game.soloMode[ONE].time) && position === "0") {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[TWO], game.soloMode[ONE].time, game.soloMode[ONE].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[ONE], timestamp, userName);
                position = "2";
            } else if (this.compareTimestamps(timestamp, game.soloMode[TWO].time) && position === "0") {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.soloMode[TWO], timestamp, userName);
                position = "3";
            }

            return position;
        }

        public rearrangeLeaderboardMulti(game: GameCard, timestamp: string, userName: string): string {
            const ZERO: number = 0;
            const ONE: number = 1;
            const TWO: number = 2;
            let position: string = "0";
            if (this.compareTimestamps(timestamp, game.multiPlayer[ZERO].time)) {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[TWO], game.multiPlayer[ONE].time, game.multiPlayer[ONE].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[ONE], game.multiPlayer[ZERO].time, game.multiPlayer[ZERO].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[ZERO], timestamp, userName);
                position = "1";
            } else if (this.compareTimestamps(timestamp, game.multiPlayer[ONE].time) && position === "0") {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[TWO], game.multiPlayer[ONE].time, game.multiPlayer[ONE].username);
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[ONE], timestamp, userName);
                position = "2";
            } else if (this.compareTimestamps(timestamp, game.multiPlayer[TWO].time) && position === "0") {
                UpdateLeaderboardRoute.UpdateLeaderboardService.takePlaceInLeaderBoard(
                    game.multiPlayer[TWO], timestamp, userName);
                position = "3";
            }

            return position;
        }
    }
}
