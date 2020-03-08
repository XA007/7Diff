import { NextFunction, Request, Response } from "express";
import {inject, injectable, } from "inversify";
import "reflect-metadata";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {UserDatabase} from "../database/userDatabase";
import Types from "../types";

export module UserRoutes {

    @injectable()
    export class Users {

        public constructor(@inject(Types.UserDatabase) private database: UserDatabase) {}

        public isTheRightLength(str: string, min: number, max: number): boolean {
            return str.length >= min && str.length <= max;
        }
        public isAlphanumeric(str: string): boolean {
            const regex: RegExp = /[^a-zA-Z0-9àâçéèêëîïôûùüÿñæœ]/g;

            return str.match(regex) === null;
        }

        public isUserNameValid(username: string): boolean {
            const minChar: number = 4;
            const maxChar: number = 8;

            return this.isAlphanumeric(username) && this.isTheRightLength(username, minChar, maxChar);
        }

        public async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( () => {
                this.database.addUser(req.body.username);
            }).then(() => {
                res.json({added: true});
            }).catch();
        }

        public verifyUser(req: Request, res: Response, next: NextFunction): void {
            if (!this.isUserNameValid(req.params.username)) {
                const message: ConnexionMessage = {
                    isAdded: false,
                    message: "The chosen username is not valid. Please choose another one.",
                };
                res.send(JSON.stringify(message));
            } else {
                this.database.findUser(req.params.username).then((result: boolean) => {
                    if (!result) {
                        const message: ConnexionMessage = {
                            isAdded: false,
                            message: "The chosen username is not available. Please choose another one.",
                        };
                        res.send(JSON.stringify(message));
                    } else {
                        const message: ConnexionMessage = {
                            isAdded: true,
                            message: "The chosen username is available. You will be connected.",
                        };
                        res.send(JSON.stringify(message));
                    }
                }).catch();
            }
        }

        public async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
            return new Promise( () => {
                this.database.removeUser(req.params.username);
            }).then(() => {
                res.json({removed: true});
            }).catch();
        }

        public getAllUsers(req: Request, res: Response, next: NextFunction): void {
            this.database.getAllUsers().then( (users: string[]) => {
              res.send(users);
            }).catch();
        }

    }
}
