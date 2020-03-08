import {Injectable} from "@angular/core";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {FreeGame} from "../../../common/Free-Game";
import {FreeGameNotifications} from "./Notifications/Free-Game-Notifications";
import {FreeGameConst} from "./constants/free-Game-Const";
import {FreeGameViewService} from "./free-game-view.service";
import {FreeGameDbManagerService} from "./freegame-dbmanager.service";
import {GameInfoSenderService} from "./game-info-sender.service";

@Injectable({
  providedIn: "root",
})
export class FreeGameCreationService {

  public constructor(public gameInfoSender: GameInfoSenderService,
                     public freeGameView: FreeGameViewService,
                     public freeGameDBManager: FreeGameDbManagerService) { }

  public static isObjectQuantityRight(quantity: number): boolean {
    return (quantity >= FreeGameConst.MIN_QUANTITY && quantity <= FreeGameConst.MAX_QUANTITY);
  }

  public static isAtLeastOneChecked(freeGameInfo: FreeGame): boolean {
    return (freeGameInfo.isAddition || freeGameInfo.isColorChanging || freeGameInfo.isDeletion);
  }

  public static verifyFreeGameInfo(freeGameInfo: FreeGame): string {
    let errorMessage: string = "";
    if (freeGameInfo.gameName.length < FreeGameConst.MIN_NAME_LENGTH || freeGameInfo.gameName.length > FreeGameConst.MAX_NAME_LENGTH) {
      errorMessage += FreeGameNotifications.LENGTH_ERROR_MSG;
    }
    if (!FreeGameCreationService.isObjectQuantityRight(freeGameInfo.objectQuantity)) {
      errorMessage += FreeGameNotifications.QUANTITY_ERROR_MSG;
    }
    if (!FreeGameCreationService.isAtLeastOneChecked(freeGameInfo)) {
      errorMessage += FreeGameNotifications.MODIFICATION_ERROR_MSG;
    }

    return errorMessage;
  }

  // not testable; would result in integration test
  public async sendFormOrTriggerError(freeGameInfo: FreeGame): Promise<string> {
    const ONE_SECOND: number = 1000;
    let errorMessage: string = FreeGameCreationService.verifyFreeGameInfo(freeGameInfo);
    await this.freeGameDBManager.verifyGameName(freeGameInfo.gameName).then((message: ConnexionMessage) => {
      if (!message.isAdded) {errorMessage += FreeGameNotifications.GAME_NAME_ALREADY_USED_MSG + " \n"; }}).catch();
    if (errorMessage === "") {
      this.gameInfoSender.sendFreeGameData(freeGameInfo).then(() => {
        this.freeGameView.createSceneVignet(freeGameInfo.gameName).then((result: string) => {
          freeGameInfo.dataURL = result;
          setTimeout( () => {
            this.gameInfoSender.saveFreeGameToDb(freeGameInfo).then(() => {
              window.location.reload();
            }).catch();
          },          ONE_SECOND);
        }).catch();
      }).catch();
    }

    return errorMessage;
  }
}
