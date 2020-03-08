import { injectable } from "inversify";
const mongo: Function = require("mongojs");
import {Db} from "mongodb";
import {MONGODB_URI} from "../../../client/src/services/constants/Connections";

@injectable()
export class UserDatabase {

    private db: Db;

    public constructor() {
        this.db = mongo(MONGODB_URI);
    }

    public addUser(username: string): void {
        this.db.collection("users").insert({username: username});
    }
    public findUser(username: string): Promise<boolean> {
        return new Promise((resolve: Function) => {
            this.db.collection("users").find({username: username}).toArray((err: Error, res: Object[]) => {
                if (err) {throw err; }

                resolve(res.length === 0);
            });
        });
    }
    public removeUser(username: string): void {
        this.db.collection("users").remove({username: username});
    }
    public getAllUsers(): Promise<string[]> {
        return new Promise( (resolve: Function) => {
            const users: string[] = [];
            this.db.collection("users").find().toArray((err: Error, res: Object[]) => {
                if (err) {throw err; }
                for (const user of res) {
                    users.push(user["username"]);
                }
                resolve(users);
            });
        });
    }
}
