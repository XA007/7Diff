import * as fs from "fs";
import {injectable} from "inversify";
import "reflect-metadata";

export module FreeViewDifference {

    @injectable()
    export class FreeViewDifferenceService {

        public static checkIfDifference(gameName: string, uuid: string): boolean {
            const file: string = fs.readFileSync("objects/" + gameName + "-differentObjects.json").toString();

            return file.includes(uuid);
        }
    }
}
