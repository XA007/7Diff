import * as fs from "fs";
import {inject, injectable} from "inversify";
import {FreeViewGameAsset} from "../../../common/FreeViewGame-Asset";
import {GameAsset} from "../../../common/Game-Asset";
import {LeaderBoard} from "../../../common/LeaderBoard";
import {Pixel} from "../../../common/Pixel";
import {FreeViewGameDatabase} from "../database/freeViewGameDatabase";
import {SimpleViewGameDatabase} from "../database/simpleViewGameDatabase";
import Types from "../types";
import {CoordinateConverter} from "./DifferencesGenerator/CoordConverter";
import {SocketService} from "./SocketService";

const MIN_MIN: number = 5;
const MAX_MIN: number = 10;
const MIN_SEC: number = 0;
const MAX_SEC: number = 60;
const DELIMITER: string = process.platform.indexOf("win") === 0 ? "\\" : "/";

@injectable()
export class GameService {
    public constructor(@inject(Types.SimpleViewGameDatabase) private simpleGameDatabase: SimpleViewGameDatabase,
                       @inject(Types.FreeViewGameDatabase) private freeGameDatabase: FreeViewGameDatabase,
                       @inject(Types.SocketService) private sockets: SocketService) {}

    public static buildString(number1: number, number2: number): string  {
        let num1: string;
        let num2: string;

        (number1 < MAX_MIN) ? num1 = "0" + number1.toString() : num1 = number1.toString();
        (number2 < MAX_MIN) ? num2 = "0" + number2.toString() : num2 = number2.toString();

        return (num1 + " : " + num2);
    }

    public static randomTime(): string[] {
        let randomSec: number = 0;
        let randomMin: number = 0;
        const randomTime: string[] = [];
        const leaderBoardPositions: number = 3;

        for (let i: number = 0; i < leaderBoardPositions; i++) {
            randomMin = Math.round(Math.random() * (MAX_MIN - MIN_MIN) + MIN_MIN);
            randomSec = Math.round(Math.random() * (MAX_SEC - MIN_SEC) + MIN_SEC);

            randomTime.push( GameService.buildString(randomMin, randomSec));
        }

        randomTime.sort(( n1: string , n2: string ) => ( n1 < n2 ) ? - 1 :  1);

        return (randomTime);
    }

    public static validateCoords(gameName: string, clickX: number, clickY: number): Pixel[] | undefined {

        const mapString: string = __dirname + DELIMITER + "../../../../simpleGameMaps/" + gameName + "-maps.json";
        const setString: string = __dirname + DELIMITER + "../../../../simpleGameMaps/" + gameName + "-sets.json";
        const offsetString: string = __dirname + DELIMITER + "../../../../simpleGameMaps/" + gameName + "-offset.json";

        try {
            const offset: number = JSON.parse(fs.readFileSync(offsetString).toString())["offset"];
            const index: number = CoordinateConverter.coordinateToStartIndex(clickX, clickY, offset);
            const pixelsString: string = fs.readFileSync(mapString).toString();
            const pixel: Pixel = JSON.parse(pixelsString)[index];
            const pixelsDiffGroupString: string = fs.readFileSync(setString).toString();
            const differencesPixelsArray: Pixel[] = JSON.parse(pixelsDiffGroupString)[pixel.label];

            return differencesPixelsArray ? differencesPixelsArray : undefined;
        } catch (err) {
            throw err;
        }
    }

    public static generateValidUserName(): string {
        const numberBase: number = 36;
        const startIndex: number = 2;
        const endIndex: number = 10;

        return Math.random().toString(numberBase).substring(startIndex, endIndex);
    }

    public static generateLeaderBoard(): LeaderBoard[] {
        const soloTime: string[] = GameService.randomTime();
        const FIRST: number = 0;
        const SECOND: number = 1;
        const THIRD: number = 2;

        return [
            {position: 1, username: GameService.generateValidUserName(), time: soloTime[FIRST]},
            {position: 2, username: GameService.generateValidUserName(), time: soloTime[SECOND]},
            {position: 3, username: GameService.generateValidUserName(), time: soloTime[THIRD]},
        ];
    }

    public async addSimpleGameToDB(name: string, urlOriginal: string, urlModified: string,
                                   originalImageName: string, modifiedImageName: string): Promise<void> {

        const gameAsset: GameAsset = {
            gameCard: {
                name: name,
                imageUrl: urlOriginal,
                soloMode: GameService.generateLeaderBoard(),
                multiPlayer: GameService.generateLeaderBoard(),
                multiPlayerButtonName: "Create",
            },
            modifiedImage: {
                name: modifiedImageName,
                url: urlModified,
            },
            originalImage: {
                name: originalImageName,
                url: urlOriginal,
            },
        };
        await this.simpleGameDatabase.addGame(gameAsset);
        this.sockets.emitNewCard(gameAsset.gameCard.name);
    }

    public async addFreeGameToDB(name: string, urlOriginal: string, originalObjectArray: string,
                                 modifiedObjectArray: string, modifications: string[]): Promise<void> {

        const soloMode: LeaderBoard[] = GameService.generateLeaderBoard();
        const multiPlayer: LeaderBoard[] = GameService.generateLeaderBoard();

        const gameAsset: FreeViewGameAsset = {
            gameCard: {
                name: name,
                imageUrl: urlOriginal,
                soloMode: soloMode,
                multiPlayer: multiPlayer,
                multiPlayerButtonName: "Create",
            },
            originalObjects: originalObjectArray,
            modifications: modifications,
            modifiedObjects: modifiedObjectArray,
        };
        await this.freeGameDatabase.addGame(gameAsset);
        this.sockets.emitNewCard(gameAsset.gameCard.name);
    }

    public reinitializeLeaderBoard(gameName: string, isSimpleGame: boolean): void {
        isSimpleGame ?
            this.simpleGameDatabase.reinitializeLeaderboard(gameName, GameService.generateLeaderBoard(), GameService.generateLeaderBoard())
            : this.freeGameDatabase.reinitializeLeaderboard(gameName, GameService.generateLeaderBoard(), GameService.generateLeaderBoard());
    }

    public async verifyGameExists(gameName: string): Promise<Boolean> {
        return this.simpleGameDatabase.findGame(gameName);
    }
}
