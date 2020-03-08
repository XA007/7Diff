import {HttpClient} from "@angular/common/http";
import {Injectable, NgModule} from "@angular/core";
import {Observable} from "rxjs";
import {GameAsset} from "../../../common/Game-Asset";
import {GameCard} from "../../../common/Game-Card";
import {Pixel} from "../../../common/Pixel";
import * as serverRoutes from "./constants/ClientPaths";

@Injectable({
  providedIn: "root",
})
@NgModule()
export class SimpleGameDbManagerService {

  public constructor(private http: HttpClient) {}

  public removeSimpleGame(gameName: string): Promise<Object> {
    return this.http.delete(serverRoutes.REMOVE_SIMPLE_GAME + gameName).toPromise();
  }

  public getSimpleGames(): Observable<GameCard[]> {
    return this.http.get<GameCard[]>(serverRoutes.SIMPLE_GAME_BASE_URL);
  }

  public getSimpleGameByName(name: string): Observable<GameAsset> {
    return this.http.get<GameAsset>(serverRoutes.GET_SIMPLE_GAME_BY_NAME + name);
  }

  public updateLeaderboard(gameName: string, userName: string, timestamp: string, multiPlayer: boolean): Promise<Object> {
    return this.http.post(serverRoutes.UPDATE_SIMPLE_LEADER_BOARD, {gameName: gameName,
                                                                    userName: userName,
                                                                    timestamp: timestamp,
                                                                    multiPlayer: multiPlayer},
                          {responseType: "text"}).toPromise();
  }

  public verifyCoordinates(gameName: string, clickX: number, clickY: number): Promise<Pixel[]> | undefined {
    return this.http.post<Pixel[]>(serverRoutes.VERIFY_COORDS, {gameName: gameName,
                                                                clickX: clickX,
                                                                clickY: clickY}, ).toPromise();
  }

  public reinitializeLeaderboard(gameName: string): void {
    this.http.post(serverRoutes.REINITIALIZE_SIMPLE_GAME,
                   {gameName: gameName}, {responseType: "text"}).toPromise();
  }
}
