import {assert} from "chai";
import "reflect-metadata";
import * as sinon from "sinon";
import {LeaderBoard} from "../../../common/LeaderBoard";
import {FreeViewGameDatabase} from "../database/freeViewGameDatabase";
import {SimpleViewGameDatabase} from "../database/simpleViewGameDatabase";
import {SocketService} from "../services/SocketService";
import {GameService} from "../services/gameService";

describe("randomTime function", () => {

    it("it should return 3 time values", () => {
        const EXPECTED_VALUE: number = 3;
        const result: string[] = GameService.randomTime();
        assert.equal(result.length, EXPECTED_VALUE);
    });

    it("it should return a length of 7 for each element in the array", () => {
        const EXPECTED_VALUE: number = 7;
        const result: string[] = GameService.randomTime();
        assert.equal(result[0].length, EXPECTED_VALUE);
    });
});

describe("buildString function", () => {
    const EXPECTED_VALUE: number = 7;
    const ONE: number = 1;
    const TEN: number = 10;

    it("should return a string of size 7", () => {
        const result: string = GameService.buildString(ONE, ONE);
        assert.equal(result.length, EXPECTED_VALUE);
    });

    it("should return a string of size 7", () => {
        const result: string = GameService.buildString(ONE, TEN);
        assert.equal(result.length, EXPECTED_VALUE);
    });

    it("should return a string of size 7", () => {
        const result: string = GameService.buildString(TEN, ONE);
        assert.equal(result.length, EXPECTED_VALUE);
    });
});

describe("makeValidUserName function", () => {

    let validUsername: string;
    beforeEach(() => {
        validUsername = GameService.generateValidUserName();
    });

    const numberOfTestCase: number = 10;
    const userNameLength: number = 8;
    for (let i: number = 0; i <= numberOfTestCase; i++) {
        it("Should return true if username has the right length", () => {
            assert.equal(validUsername.length, userNameLength);
        });
    }
});

describe("generateLeaderboard function", () => {
    const leaderBoardSize: number = 3;

    const leaderBoard: LeaderBoard[] = GameService.generateLeaderBoard();
    assert.strictEqual(leaderBoard.length, leaderBoardSize);
});

describe("reinitializeLeaderboard function should call simpleGameDb.reinitializeLeaderboard if simple game", () => {
    const simpleGameDb: SimpleViewGameDatabase = new SimpleViewGameDatabase();
    const freeGameDb: FreeViewGameDatabase = new FreeViewGameDatabase();
    const sockets: SocketService = new SocketService();
    const game: GameService = new GameService(simpleGameDb, freeGameDb, sockets);
    const simpleDbStub: sinon.SinonStub = sinon.stub(simpleGameDb, "reinitializeLeaderboard");

    game.reinitializeLeaderBoard("testGame", true);
    sinon.assert.called(simpleDbStub);
});

describe("addFreeGameToDB function should call freeGameDB.addGame ", () => {
    const simpleGameDb: SimpleViewGameDatabase = new SimpleViewGameDatabase();
    const freeGameDb: FreeViewGameDatabase = new FreeViewGameDatabase();
    const sockets: SocketService = new SocketService();
    const game: GameService = new GameService(simpleGameDb, freeGameDb, sockets);
    const freeDBStub: sinon.SinonStub = sinon.stub(freeGameDb, "addGame");

    game.addFreeGameToDB("testGame", "", "", "", [""]).catch();
    sinon.assert.called(freeDBStub);
});

describe("addSimpleGameToDB function should call simpleGameDb.addGame ", () => {
    const simpleGameDb: SimpleViewGameDatabase = new SimpleViewGameDatabase();
    const freeGameDb: FreeViewGameDatabase = new FreeViewGameDatabase();
    const sockets: SocketService = new SocketService();
    const game: GameService = new GameService(simpleGameDb, freeGameDb, sockets);
    const simpleDbStub: sinon.SinonStub = sinon.stub(simpleGameDb, "addGame");
    game.addSimpleGameToDB("testGame", "", "", "", "").then().catch();
    sinon.assert.called(simpleDbStub);
});

describe("verifyGameExists function should call simpleGameDb.findGame ", () => {
    const simpleGameDb: SimpleViewGameDatabase = new SimpleViewGameDatabase();
    const freeGameDb: FreeViewGameDatabase = new FreeViewGameDatabase();
    const sockets: SocketService = new SocketService();
    const game: GameService = new GameService(simpleGameDb, freeGameDb, sockets);
    const simpleDbStub: sinon.SinonStub = sinon.stub(simpleGameDb, "findGame");
    game.verifyGameExists("testGame").then().catch();
    sinon.assert.called(simpleDbStub);
});
