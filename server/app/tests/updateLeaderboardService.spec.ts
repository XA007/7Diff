import {assert} from "chai";
import "reflect-metadata";
import * as sinon from "sinon";
import {FreeViewGameAsset} from "../../../common/FreeViewGame-Asset";
import {LeaderBoard} from "../../../common/gameAssets/LeaderBoard";
import {UpdateLeaderboardRoute} from "../services/updateLeaderboardService";
import UpdateLeaderboardService = UpdateLeaderboardRoute.UpdateLeaderboardService;

describe("updateLeaderBoard service", async () => {
    const updateLeaderboard: UpdateLeaderboardRoute.UpdateLeaderboardService = new UpdateLeaderboardRoute.UpdateLeaderboardService();
    const leaderboardArray: LeaderBoard[] = [
        {position: 1, username: "1", time: "00 : 10"},
        {position: 2, username: "2", time: "00 : 10"},
        {position: 3, username: "3", time: "00 : 10"},
    ];
    const freeGameAsset: FreeViewGameAsset = {
        gameCard: {
            name: "updateLeaderBoard",
            imageUrl:  "",
            soloMode: leaderboardArray,
            multiPlayer: leaderboardArray,
            multiPlayerButtonName: "Create",
        },
        originalObjects: "",
        modifications: [""],
        modifiedObjects: "",
    };

    it("should return first position when rearrangeLeaderboard is called with best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 01", "testingBoy"), "1");
    });

    it("should return second position when rearrangeLeaderboard is called with second best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 02", "testingBoy"), "2");
    });

    it("should return third position when rearrangeLeaderboard is called with third best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 03", "testingBoy"), "3");
    });

    it("should return 0 when rearrangeLeaderboard is called with fourth best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 04", "testingBoy"), "0");
    });

    it("should return second position when rearrangeLeaderboard is called with same best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 01", "testingBoy"), "2");
    });

    it("should return third position when rearrangeLeaderboard is called with same second best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 01", "testingBoy"), "3");
    });

    it("should return 0 when rearrangeLeaderboard is called with same third best time", () => {
        assert.equal(updateLeaderboard.rearrangeLeaderboard(freeGameAsset.gameCard, "00 : 02", "testingBoy"), "0");
    });

    it("should return true if new time > old time", () => {
        assert.strictEqual(updateLeaderboard.compareTimestamps("00:02", "01:02"), true);
    });

    it("should return 1", () => {
        const leaderboardStub: sinon.SinonStub = sinon.stub(updateLeaderboard, "updateSimpleGameLeaderboard");
        leaderboardStub.resolves("1");
        updateLeaderboard.updateSimpleGameLeaderboard("updateLeaderBoard", "testUser", "00:05", true).then( (response: string) => {
            assert.strictEqual(response, "1");
        }).catch();
    });

    it("should return 1", () => {
        const leaderboardStub: sinon.SinonStub = sinon.stub(updateLeaderboard, "updateFreeGameLeaderboard");
        leaderboardStub.resolves("1");
        updateLeaderboard.updateFreeGameLeaderboard("testGame", "testUser", "00:10", false).then( (response: string) => {
            assert.strictEqual(response, "1");
        }).catch();
    });

    it("should change the leaderBoard", () => {
        const board: LeaderBoard = {
            position: 1,
            username: "user",
            time: "00:20",
        };

        UpdateLeaderboardService.takePlaceInLeaderBoard(board, "00:10", "newUser");
        assert.strictEqual(board.time, "00:10");
    });

    it("should change the leaderBoard", () => {
        const board: LeaderBoard = {
            position: 1,
            username: "user",
            time: "00:20",
        };

        UpdateLeaderboardService.takePlaceInLeaderBoard(board, "00:10", "newUser");
        assert.strictEqual(board.username, "newUser");
    });
});
