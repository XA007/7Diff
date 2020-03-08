import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import * as MULTER from "multer";
import * as serverRoutes from "./RouteConstants";
import { FormRoutes } from "./routes/form";
import {FreeViewGameRoutes} from "./routes/freeViewGames";
import {SimpleViewGameRoutes} from "./routes/simpleViewGames";
import { UserRoutes } from "./routes/users";
import {UpdateLeaderboardRoute} from "./services/updateLeaderboardService";
import Types from "./types";

@injectable()
export class Routes {

    public constructor(@inject(Types.Form) private form: FormRoutes.Form,
                       @inject(Types.Users) private user: UserRoutes.Users,
                       @inject(Types.SimpleViewGames) private simpleGames: SimpleViewGameRoutes.SimpleViewGames,
                       @inject(Types.FreeViewGames) private freeGames: FreeViewGameRoutes.FreeViewGames,
                       @inject(Types.UpdateLeaderBoard) private updateLeaderboard: UpdateLeaderboardRoute.UpdateLeaderboardService) { }

    public get routes(): Router {
        const router: Router = Router();
        const upload: MULTER.Instance = MULTER({dest: "uploads/"});
        const memoryStorage: MULTER.Instance = MULTER({storage: MULTER.memoryStorage()});

        router.get("/users",
                   (req: Request, res: Response, next: NextFunction) => this.user.getAllUsers(req, res, next));

        router.post(serverRoutes.ADD_USER,
                    (req: Request, res: Response, next: NextFunction) => this.user.addUser(req, res, next));

        router.get(serverRoutes.VERIFY_USER + ":username",
                   (req: Request, res: Response, next: NextFunction) => this.user.verifyUser(req, res, next));

        router.delete(serverRoutes.REMOVE_USER + ":username",
                      (req: Request, res: Response, next: NextFunction) => this.user.removeUser(req, res, next));

        router.post(serverRoutes.VERIFY_FORM,
                    memoryStorage.any(),
                    (req: Request, res: Response, next: NextFunction) => this.form.verifyForm(req, res, next));

        router.post(serverRoutes.GENERATE_DIFFS,
                    upload.any(),
                    (req: Request, res: Response, next: NextFunction) => this.form.generateDifferencesImage(req, res, next));

        router.post(serverRoutes.SEND_FREE_GAME_DATA,
                    (req: Request, res: Response, next: NextFunction) => this.form.receiveFreeGameInfo(req, res, next));

        /* Routes for Simple View Games */
        router.get(serverRoutes.SIMPLE_GAME_BASE_URL,
                   (req: Request, res: Response, next: NextFunction) => this.simpleGames.getAllGames(req, res, next));

        router.get(serverRoutes.GET_SIMPLE_GAME_BY_NAME + ":gamename",
                   (req: Request, res: Response, next: NextFunction) => this.simpleGames.getGameCard(req, res, next));

        router.post("/games/simplegames/add",
                    (req: Request, res: Response, next: NextFunction) => this.simpleGames.addGame(req, res, next));

        router.get("/games/simplegames/verify/:gamename",
                   (req: Request, res: Response, next: NextFunction) => this.simpleGames.findGame(req, res, next));

        router.delete(serverRoutes.REMOVE_SIMPLE_GAME + ":gamename",
                      (req: Request, res: Response, next: NextFunction) => this.simpleGames.removeGame(req, res, next));

        router.post(serverRoutes.UPDATE_SIMPLE_LEADER_BOARD,
                    (req: Request, res: Response, next: NextFunction) => this.updateLeaderboard.updateLeaderBoard(req, res, next, true));

        router.post(serverRoutes.VERIFY_COORDS,
                    (req: Request, res: Response, next: NextFunction) => this.simpleGames.verifyCoords(req, res, next));

        router.post(serverRoutes.REINITIALIZE_SIMPLE_GAME,
                    (req: Request, res: Response, next: NextFunction) => this.simpleGames.reinitializeLeaderboard(req, res, next));

        /* Routes for Free View Games */
        router.get(serverRoutes.FREE_GAME_BASE_URL,
                   (req: Request, res: Response, next: NextFunction) => this.freeGames.getAllGames(req, res, next));

        router.get(serverRoutes.GET_FREE_GAME_BY_NAME + ":gamename",
                   (req: Request, res: Response, next: NextFunction) => this.freeGames.getGameCard(req, res, next));

        router.post("/games/freegames/add",
                    (req: Request, res: Response, next: NextFunction) => this.freeGames.addGame(req, res, next));

        router.post("/games/freegames/imageInit",
                    (req: Request, res: Response, next: NextFunction) => this.freeGames.initializeImage(req, res, next));

        router.get(serverRoutes.VERIFY_FREE_GAME + ":gamename",
                   (req: Request, res: Response, next: NextFunction) => this.freeGames.findGame(req, res, next));

        router.delete(serverRoutes.REMOVE_FREE_GAME + ":gamename",
                      (req: Request, res: Response, next: NextFunction) => this.freeGames.removeGame(req, res, next));

        router.get("/objectCreator",
                   (req: Request, res: Response, next: NextFunction) => this.freeGames.getObjects(req, res, next));

        router.post(serverRoutes.UPDATE_FREE_LEADER_BOARD,
                    (req: Request, res: Response, next: NextFunction) => this.updateLeaderboard.updateLeaderBoard(req, res, next, false));

        router.post(serverRoutes.REINITIALIZE_FREE_GAME,
                    (req: Request, res: Response, next: NextFunction) => this.freeGames.reinitializeLeaderboard(req, res, next));

        router.post(serverRoutes.VERIFY_FREE_GAME_DIFF,
                    (req: Request, res: Response, next: NextFunction) => this.freeGames.checkIfDifference(req, res, next));

        router.post(serverRoutes.SAVE_FREE_GAME,
                    (req: Request, res: Response, next: NextFunction) => this.form.addFreeGameToDB(req, res, next));

        return router;
    }
}
