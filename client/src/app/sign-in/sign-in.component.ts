import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConnexionMessage } from "../../../../common/ConnexionMessage";
import { RoutesGuardService } from "../../services/routes-guard.service";
import { SignInService } from "../../services/sign-in.service";
import {SocketClientService} from "../../services/socket-client.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})

export class SignInComponent implements OnInit {

  public isConnected: boolean;
  public userName: string;
  public isUserNameValid: boolean;
  private body: string;
  public message: string;

  public constructor(private signIn: SignInService,
                     private router: Router,
                     private routeGuard: RoutesGuardService,
                     private socketService: SocketClientService) { }

  public ngOnInit(): void {
    this.isConnected = this.signIn.isConnected;
  }

  public async connect(username: string): Promise<void> {
    if (!username || !this.signIn.isUserNameValid(username)) {
      return new Promise((resolve) => {
        resolve();
      }).then(() => {
        this.notify();
      },
      );
    }
    await new Promise((resolve) => {
      resolve(this.signIn.connect(username)
        .then((connexionMsg: ConnexionMessage) => {
          if (connexionMsg.isAdded) {
            this.routeGuard.authenticated = true;
            this.goHome(username);
          }
          this.body = connexionMsg.message;
          this.isConnected = connexionMsg.isAdded;
        }));
    }).then(() => {
      this.message = this.body;
    });
  }

  public notify(): void {
    this.isUserNameValid = true;
  }

  public makeUserName(): void {
    this.userName = this.signIn.generateValidUserName();
  }

  public goHome(username: string): void {
    const date: Date = new Date();
    const datetext: string = date.toTimeString().split(" ")[0];
    const message: string = datetext + " - " + username + " vient de se connecter.";
    this.socketService.send(message);
    this.router.navigate(["home/" + username]).catch();
  }

}
