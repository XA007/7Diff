import { injectable } from "inversify";
const mongo: Function = require("mongojs");
import {Db} from "mongodb";
import {MONGODB_URI} from "../../../client/src/services/constants/Connections";
import {GameAsset} from "../../../common/Game-Asset";
import {LeaderBoard} from "../../../common/gameAssets/LeaderBoard";

@injectable()
export class SimpleViewGameDatabase {

    private db: Db;

    public constructor() {
        this.db = mongo(MONGODB_URI);
    }

    public async addGame(game: GameAsset): Promise<void> {
        await this.db.collection("simpleViewGames").insert(game);
    }
    public findGame(gameName: string): Promise<boolean> {
        return new Promise((resolve: Function) => {
            this.db.collection("simpleViewGames").find({"gameCard.name": gameName}).toArray((err: Error, res: GameAsset[]) => {
                if (err) {throw err; }

                resolve(res.length === 0);
            });
        });
    }
    public removeGame(gameName: string): void {
        this.db.collection("simpleViewGames").remove({"gameCard.name": gameName});
    }
    public getAllGames(): Promise<GameAsset[]> {
        return new Promise( (resolve: Function) => {
            const games: GameAsset[] = [];
            this.db.collection("simpleViewGames").find().toArray((err: Error, res: GameAsset[]) => {
                if (err) {throw err; }
                for (const game of res) {
                    games.push(game);
                }
                resolve(games);
            });
        });
    }
    public getGameCard(gameName: string): Promise<GameAsset> {
        return new Promise( (resolve: Function) => {
            this.db.collection("simpleViewGames").find({"gameCard.name": gameName}).toArray((err: Error, res: GameAsset[]) => {
                if (err) {throw err; }
                resolve(res[0]);
            });
        });
    }

    public reinitializeLeaderboard(gameName: string, soloMode: LeaderBoard[], multiPlayer: LeaderBoard[]): void {
            this.db.collection("simpleViewGames").update({"gameCard.name": gameName},
                                                         {$set: {"gameCard.soloMode": soloMode,
                                                                 "gameCard.multiPlayer": multiPlayer}});
    }
}
