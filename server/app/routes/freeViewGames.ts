import { NextFunction, Request, Response } from "express";
import {inject, injectable, } from "inversify";
import "reflect-metadata";
import * as THREE from "three";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {GameCard} from "../../../common/Game-Card";
import {RoomInterface} from "../../../common/RoomInterface";
import {FreeViewGameDatabase} from "../database/freeViewGameDatabase";
import {SocketService} from "../services/SocketService";
import {FreeViewDifference} from "../services/freeViewDifferenceService";
import {GameService} from "../services/gameService";
import {ObjectCreatorService} from "../services/objectCreatorService";
import Types from "../types";

export module FreeViewGameRoutes {

    @injectable()
    export class FreeViewGames {

        public constructor(@inject(Types.FreeViewGameDatabase) private database: FreeViewGameDatabase,
                           @inject(Types.GameService) private game: GameService,
                           @inject(Types.ObjectCreatorService) private objectCreator: ObjectCreatorService,
                           @inject(Types.SocketService) private sockets: SocketService) {}

        public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( () => {
                this.database.addGame(req.body.game).then().catch();
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
            this.database.getAllGames().then( (games: GameCard[]) => {
                const rooms: RoomInterface[] = this.sockets.rooms;
                for (const game of games) {
                    for (const room of rooms) {
                        if (room.gameName === game.name && !this.sockets.isRoomFull(room) && !room.isSimpleGame) {
                            game.multiPlayerButtonName = "Join";
                        }
                    }
                }
                res.send(JSON.stringify(games));
            }).catch();
        }

        public getGameCard(req: Request, res: Response, next: NextFunction): void {
            this.database.getGameCard(req.params.gamename).then( (game: GameCard) => {
                res.send(JSON.stringify(game));
            }).catch();
        }

        public async reinitializeLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
            this.game.reinitializeLeaderBoard(req.body.gameName, false);

            return new Promise((resolve: Function) => {
                resolve("Success");
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async initializeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
            this.database.initializeImage(req.body.gameName, req.body.image);

            return new Promise((resolve: Function) => {
                resolve("Success");
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async getObjects(req: Request, res: Response, next: NextFunction): Promise<void> {
            const OBJECT_NUMBER: number = 20;

            return new Promise((resolve: Function) => {
                resolve(this.objectCreator.createObjects(OBJECT_NUMBER));
            }).then( (ans: THREE.Object3D[]) => {
                res.send(ans);
            });
        }

        public async checkIfDifference(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( (resolve: Function) => {
                resolve(FreeViewDifference.FreeViewDifferenceService.checkIfDifference(req.body.gameName, req.body.uuid));
            }).then((value: boolean) => {
                res.send(value);
            });
        }

    }
}
