import { injectable } from "inversify";
import {Db} from "mongodb";
import {MONGODB_URI} from "../../../client/src/services/constants/Connections";
import {FreeViewGameAsset} from "../../../common/FreeViewGame-Asset";
import {GameCard} from "../../../common/Game-Card";
import {LeaderBoard} from "../../../common/gameAssets/LeaderBoard";

const mongo: Function = require("mongojs");

@injectable()
export class FreeViewGameDatabase {

    private db: Db;

    public constructor() {
        this.db = mongo(MONGODB_URI);
    }

    public async addGame(game: FreeViewGameAsset): Promise<void> {
        await this.db.collection("freeViewGames").insert(game);
    }

    public findGame(gameName: string): Promise<boolean> {
        return new Promise((resolve: Function) => {
            this.db.collection("freeViewGames").find({"gameCard.name": gameName}).toArray((err: Error, res: FreeViewGameAsset[]) => {
                if (err) {throw err; }

                resolve(res.length === 0);
            });
        });
    }

    public removeGame(gameName: string): void {
        this.db.collection("freeViewGames").remove({"gameCard.name": gameName});
    }

    public getAllGames(): Promise<GameCard[]> {
        return new Promise( (resolve: Function) => {
            const games: GameCard[] = [];
            this.db.collection("freeViewGames").find().toArray((err: Error, res: FreeViewGameAsset[]) => {
                if (err) {throw err; }
                for (const game of res) {
                    games.push(game.gameCard);
                }
                resolve(games);
            });
        });
    }
    public getGameCard(gameName: string): Promise<GameCard> {
        return new Promise( (resolve: Function) => {
            this.db.collection("freeViewGames").find({"gameCard.name": gameName}).toArray((err: Error, res: FreeViewGameAsset[]) => {
                if (err) {throw err; }
                resolve(res[0].gameCard);
            });
        });
    }

    public reinitializeLeaderboard(gameName: string, soloMode: LeaderBoard[], multiPlayer: LeaderBoard[]): void {
        this.db.collection("freeViewGames").update({"gameCard.name": gameName},
                                                   {$set: {"gameCard.soloMode": soloMode,
                                                           "gameCard.multiPlayer": multiPlayer}});
    }

    public initializeImage(gameName: string, image: string): void {
        this.db.collection("freeViewGames").update({"gameCard.name": gameName},
                                                   {$set: {"gameCard.soloMode": image}});
    }
}
