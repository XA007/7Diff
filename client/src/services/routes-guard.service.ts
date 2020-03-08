import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import {UserDBManagerService} from "./user-dbmanager.service";

@Injectable({
  providedIn: "root",
})

export class RoutesGuardService implements CanActivate {

  public authenticated: boolean;

  public constructor(private router: Router, private userDBManager: UserDBManagerService) {
    this.authenticated = false;
  }

  public canActivate(): boolean {

    if (!this.authenticated) {
      this.router.navigate(["/signin"]).catch();

      return false;
    }

    return true;

  }

  public userInDB(username: string): boolean {
    this.userDBManager.verifyUser(username).subscribe( (message: ConnexionMessage) => {
      this.authenticated = message.isAdded;
    });

    return this.canActivate();
  }
}
