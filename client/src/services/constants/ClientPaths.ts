import {SERVER_URL} from "./Connections";

export const VERIFY_USER: string = SERVER_URL + "/verify/";
export const ADD_USER: string =  SERVER_URL + "/add/";
export const REMOVE_USER: string = SERVER_URL + "/remove/";

export const SIMPLE_GAME_BASE_URL: string = SERVER_URL + "/games/simplegames/";
export const REMOVE_SIMPLE_GAME: string = SIMPLE_GAME_BASE_URL + "remove/";
export const GET_SIMPLE_GAME_BY_NAME: string = SIMPLE_GAME_BASE_URL + "games/";
export const UPDATE_SIMPLE_LEADER_BOARD: string = SIMPLE_GAME_BASE_URL + "updateleaderboard/";
export const VERIFY_COORDS: string = SIMPLE_GAME_BASE_URL + "verifyCoords/";

export const FREE_GAME_BASE_URL: string = SERVER_URL + "/games/freegames/";
export const REMOVE_FREE_GAME: string = FREE_GAME_BASE_URL + "remove/";
export const VERIFY_FREE_GAME: string = FREE_GAME_BASE_URL + "verify/";
export const GET_FREE_GAME_BY_NAME: string = FREE_GAME_BASE_URL + "games/";
export const UPDATE_FREE_LEADER_BOARD: string = FREE_GAME_BASE_URL + "updateleaderboard/";

export const VERIFY_FORM: string = SERVER_URL + "/formverification";
export const GENERATE_DIFFS: string = SERVER_URL + "/generatedifferences";
export const SEND_FREE_GAME_DATA: string = SERVER_URL + "/freegameinfo";
export const SAVE_FREE_GAME: string = SERVER_URL + "/savefreegame";
export const VERIFY_FREE_GAME_DIFF: string = SERVER_URL + "/freegamedifference";

export const REINITIALIZE_SIMPLE_GAME: string = SERVER_URL + "/reinitializesimple";
export const REINITIALIZE_FREE_GAME: string = SERVER_URL + "/reinitializefree";
