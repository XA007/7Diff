import {HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FreeGame} from "../../../common/Free-Game";
import * as serverRoutes from "./constants/ClientPaths";

@Injectable({
  providedIn: "root",
})
export class GameInfoSenderService {

  public constructor( private http: HttpClient) { }

  public verifyForm(formData: FormData): Promise<string> {
    return this.http.post(serverRoutes.VERIFY_FORM,
                          formData, {responseType: "text"}).toPromise();
  }

  public generateDifferencesImage(formData: FormData): Promise<string> {
     return this.http.post(serverRoutes.GENERATE_DIFFS,
                           formData, {responseType: "text"}).toPromise();
  }

  public sendFreeGameData(freeGameInfo: FreeGame): Promise<string> {
    return this.http.post(serverRoutes.SEND_FREE_GAME_DATA,
                          {body: JSON.stringify(freeGameInfo)}, {responseType: "text"}).toPromise();
  }

  public saveFreeGameToDb(freeGameInfo: FreeGame): Promise<string> {
    return this.http.post(serverRoutes.SAVE_FREE_GAME,
                          {body: JSON.stringify(freeGameInfo)}, {responseType: "text"}).toPromise();
  }

  public verifyFreeGameDifference(uuid: string, gameName: string): Promise<boolean> {
    return this.http.post<boolean>(serverRoutes.VERIFY_FREE_GAME_DIFF, {uuid: uuid, gameName: gameName}).toPromise();
  }
}
