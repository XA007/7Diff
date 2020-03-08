import {HttpClient} from "@angular/common/http";
import {Injectable, NgModule} from "@angular/core";
import {Observable} from "rxjs";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import * as serverRoutes from "./constants/ClientPaths";

@Injectable({
  providedIn: "root",
})

@NgModule()
export class UserDBManagerService {

  public constructor(private http: HttpClient) {}

  public verifyUser(username: string): Observable<ConnexionMessage> {
      return this.http.get<ConnexionMessage>(serverRoutes.VERIFY_USER + username);
  }

  public async addUser(username: string): Promise<Object> {
      return this.http.post(serverRoutes.ADD_USER, {username: username}).toPromise();
  }

  public async removeUser(username: string): Promise<Object> {
      return this.http.delete(serverRoutes.REMOVE_USER + username).toPromise();
  }

}
