import {HttpClient} from "@angular/common/http";
import {Injectable, NgModule} from "@angular/core";
import {Observable} from "rxjs";
import * as THREE from "three";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {GameCard} from "../../../common/Game-Card";
import * as serverRoutes from "./constants/ClientPaths";
import {SERVER_URL} from "./constants/Connections";

@Injectable({
  providedIn: "root",
})

@NgModule()
export class FreeGameDbManagerService {

  public constructor(private http: HttpClient) {
  }

  public getFreeGames(): Observable<GameCard[]> {
    return this.http.get<GameCard[]>(serverRoutes.FREE_GAME_BASE_URL);
  }

  public removeFreeGame(username: string): Promise<Object> {
    return this.http.delete(serverRoutes.REMOVE_FREE_GAME + username).toPromise();
  }

  public verifyGameName(gameName: string): Promise<ConnexionMessage> {
    return this.http.get<ConnexionMessage>(serverRoutes.VERIFY_FREE_GAME + gameName).toPromise();
  }

  public getFreeGameByName(name: string): Promise<GameCard> {
    return this.http.get<GameCard>(serverRoutes.GET_FREE_GAME_BY_NAME + name).toPromise();
  }

  public updateLeaderboard(gameName: string, userName: string, timestamp: string, multiPlayer: boolean): Promise<Object> {
    return this.http.post<number>(serverRoutes.UPDATE_FREE_LEADER_BOARD, {gameName: gameName,
                                                                          userName: userName,
                                                                          timestamp: timestamp,
                                                                          multiPlayer: multiPlayer}).toPromise();
  }

  public getObjects(url: string): Observable<THREE.Object3D[]> {
    return this.http.get<THREE.Object3D[]>(SERVER_URL + "/" + url);
  }

  public reinitializeLeaderboard(gameName: string): Promise<Object> {
    return this.http.post(serverRoutes.REINITIALIZE_FREE_GAME,
                          {gameName: gameName}, {responseType: "text"}).toPromise();
  }
}
