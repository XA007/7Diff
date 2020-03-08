import * as assert from "assert";
import "reflect-metadata";
import {RoomInterface} from "../../../common/RoomInterface";
import {MockSocketService} from "../services/MockSocketService";

describe("MockSocketService Unit Testing", () => {

    describe("getRooms function", () =>  {
        const socketService: MockSocketService = new MockSocketService();
        it("should initialize correctly the rooms in the constructor", () => {
            const rooms: RoomInterface[] = socketService.getRooms();
            assert.strictEqual(rooms.length, 0);
        });
    });

    describe("roomAlreadyExists function", () =>  {
        const socketService: MockSocketService = new MockSocketService();
        const room1: RoomInterface = {
            players : [],
            name : "room1",
            gameName : "gameTest1",
            isSimpleGame : true,
        };
        const room2: RoomInterface = {
            players : [],
            name : "room2",
            gameName : "gameTest2",
            isSimpleGame : false,
        };
        socketService.getRooms().push(room1);

        it("should return true if room already exists", () => {
            assert.strictEqual(socketService.roomAlreadyExists(room1.name, room1.isSimpleGame), true);
        });

        it("should return false if room does not already exists", () => {
            assert.strictEqual(socketService.roomAlreadyExists(room2.name, room2.isSimpleGame), false);
        });
    });

    describe("createRoom function", () =>  {
        const socketService: MockSocketService = new MockSocketService();
        const room1: RoomInterface = {
            players : [],
            name : "room1",
            gameName : "gameTest1",
            isSimpleGame : true,
        };
        const room2: RoomInterface = {
            players : [],
            name : "room2",
            gameName : "gameTest2",
            isSimpleGame : false,
        };
        socketService.getRooms().push(room1);

        it("should not add the room if room exists", () => {
            socketService.createRoom(room1.name, room1.isSimpleGame);
            assert.strictEqual(socketService.getRooms().length, 1);
        });

        it("should add the room if room does not exist", () => {
            socketService.createRoom(room2.name, room2.isSimpleGame);
            assert.strictEqual(socketService.getRooms().length, 2);
        });
    });

    describe("checkIfRoomIsFull function", () =>  {
        const socketService: MockSocketService = new MockSocketService();
        const room1: RoomInterface = {
            players : ["player1"],
            name : "room1",
            gameName : "gameTest1",
            isSimpleGame : true,
        };
        socketService.getRooms().push(room1);

        const room2: RoomInterface = {
            players : ["player1", "player2"],
            name : "room2",
            gameName : "gameTest2",
            isSimpleGame : true,
        };
        socketService.getRooms().push(room2);

        it("should return false if room is not full", () => {
            assert.strictEqual(socketService.checkIfRoomIsFull(room1), false);
        });

        it("should return true if room is full", () => {
            assert.strictEqual(socketService.checkIfRoomIsFull(room2), true);
        });
    });

    describe("socketJoinRoom function", () =>  {
        const socketService: MockSocketService = new MockSocketService();
        const room1: RoomInterface = {
            players : ["player1"],
            name : "room1",
            gameName : "gameTest1",
            isSimpleGame : true,
        };
        socketService.getRooms().push(room1);

        const room2: RoomInterface = {
            players : ["player1", "player2"],
            name : "room2",
            gameName : "gameTest2",
            isSimpleGame : true,
        };
        socketService.getRooms().push(room2);

        it("should not add user if user is already in room", () => {
            socketService.socketJoinRoom(room1, "player1");
            assert.strictEqual(socketService.checkIfRoomIsFull(room1), false);
        });

        it("should add user if room is not full", () => {
            socketService.socketJoinRoom(room1, "player2");
            assert.strictEqual(socketService.checkIfRoomIsFull(room1), true);
        });

        it("should not add user if room is full", () => {
            socketService.socketJoinRoom(room2, "player3");
            assert.strictEqual(socketService.checkIfRoomIsFull(room2), true);
        });
    });
});
