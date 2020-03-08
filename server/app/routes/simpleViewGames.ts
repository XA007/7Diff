import { NextFunction, Request, Response } from "express";
import {inject, injectable, } from "inversify";
import "reflect-metadata";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {GameAsset} from "../../../common/Game-Asset";
import {GameCard} from "../../../common/Game-Card";
import {Pixel} from "../../../common/Pixel";
import {RoomInterface} from "../../../common/RoomInterface";
import {SimpleViewGameDatabase} from "../database/simpleViewGameDatabase";
import {SocketService} from "../services/SocketService";
import {GameService} from "../services/gameService";
import Types from "../types";

export module SimpleViewGameRoutes {

    @injectable()
    export class SimpleViewGames {

        public constructor(@inject(Types.SimpleViewGameDatabase) private database: SimpleViewGameDatabase,
                           @inject(Types.GameService) private game: GameService,
                           @inject(Types.SocketService) private sockets: SocketService) {}

        public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( () => {
                this.database.addGame(req.body).then().catch();
            }).then(() => {
                res.send({added: true});
            });
        }

        public findGame(req: Request, res: Response, next: NextFunction): void {
            this.database.findGame(req.params.gamename).then((result: boolean) => {
                if (!result) {
                    const message: ConnexionMessage = {
                        isAdded: false,
                        message: "This game is not available. Please choose another one.",
                    };
                    res.send(JSON.stringify(message));
                } else {
                    const message: ConnexionMessage = {
                        isAdded: true,
                        message: "",
                    };
                    res.send(JSON.stringify(message));
                }
            }).catch();
        }

        public async removeGame(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( () => {
                this.sockets.emitGameDeleted(req.params.gamename);
                this.database.removeGame(req.params.gamename);
            }).then(() => {
                res.send({removed: true});
            });
        }

        public getAllGames(req: Request, res: Response, next: NextFunction): void {
            const gameCards: GameCard[] = [];
            this.database.getAllGames().then( (games: GameAsset[]) => {
                const rooms: RoomInterface[] = this.sockets.rooms;
                for (const game of games) {
                    for (const room of rooms) {
                        if (room.gameName === game.gameCard.name && !this.sockets.isRoomFull(room) && room.isSimpleGame) {
                            game.gameCard.multiPlayerButtonName = "Join";
                        }
                    }
                    gameCards.push(game.gameCard);
                }
                res.send(JSON.stringify(gameCards));
            }).catch();
        }

        public getGameCard(req: Request, res: Response, next: NextFunction): void {
            this.database.getGameCard(req.params.gamename).then( (game: GameAsset) => {
                res.send(JSON.stringify(game));
            }).catch();
        }

        public async reinitializeLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
            this.game.reinitializeLeaderBoard(req.body.gameName, true);

            return new Promise((resolve: Function) => {
                resolve("Success");
            }).then((value: string) => {
                res.send(value);
            }).catch();
        }

        public async verifyCoords(req: Request, res: Response, next: NextFunction): Promise<void> {

            return new Promise((resolve: Function) => {
                resolve(GameService.validateCoords(req.body.gameName, req.body.clickX, req.body.clickY));
            }).then((value: Pixel[]) => {
                res.send(value);
            }).catch();
        }

    }
}
