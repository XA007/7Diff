import {Inject, Injectable} from "@angular/core";
import {ConnexionMessage} from "../../../common/ConnexionMessage";
import { UserDBManagerService } from "./user-dbmanager.service";

@Injectable({
  providedIn: "root",
})
export class SignInService {

  public isConnected: boolean;
  public users: string[];
  public constructor(@Inject(UserDBManagerService) private userDBManager: UserDBManagerService) {
    this.isConnected = false;

  }
  /**
   *
   *  @connect()
   *  Validate the user-name and connect the user.
   *  If the user-name is valid, the user is redirected to the home page.
   *
   * */
  public connect(username: string): Promise<ConnexionMessage> {
    return new Promise((resolve) => {
      this.isAlreadyUsed(username).then((res) => {
          if (res.isAdded) {
            resolve({
              isAdded: true,
              message: "",
            });
          } else {
            resolve({
              isAdded: false,
              message: res.message,
            });
          }
        }).catch();
    });
  }
  /**
   *
   *  @addUsername()
   *
   *
   * */
  public addUsername(username: string): void {
    this.userDBManager.addUser(username)
      .then(() => {
        this.isConnected = true;
      }).catch();
  }
  /**
   *
   *  @isUserNameValid()
   *  Valid user-name format
   *  Returns true if User-name is Alphanumeric, has the right length AND not already used.
   *
   * */
  public isUserNameValid(username: string): boolean {
    const minChar: number = 4;
    const maxChar: number = 8;

    return this.isAlphanumeric(username) && this.isTheRightLength(username, minChar, maxChar);
  }

  /**
   *
   * @isAlreadyUsed()
   * Verify if a string exist in an array of strings
   *
   * */
  public isAlreadyUsed(username: string): Promise<ConnexionMessage> {
   return new Promise( (resolve) => {
     this.userDBManager.verifyUser(username).subscribe((res) => {
       if (res.isAdded) {
         this.addUsername(username);
         this.isConnected = true;
         resolve({
                 isAdded: true,
                 message: res.message,
         });
       } else {
         this.isConnected = false;
         resolve({
                 isAdded: false,
                 message: res.message,
         });
       }
     });
   });
  }

  /**
   *
   * @isTheRightLength()
   * Verify if a string contains between min and max characters
   *
   * */
  public isTheRightLength(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max;
  }

  /**
   *
   * @isAlphanumeric()
   * Verify if a word contains only Alphanumeric characters. Take also in consideration french words.
   *
   * */
  public isAlphanumeric(str: string): boolean {
    const regex: RegExp = /[^a-zA-Z0-9àâçéèêëîïôûùüÿñæœ]/g;

    return str.match(regex) === null;
  }

  /**
   *
   * @generateValidUserName()
   *
   * Convert a random number to base 36. In base 36, the digits are represented using the numerals 0–9 and the letters A–Z
   * Generate and return a valid usernmae of 8 characters.
   *
   * */
  public generateValidUserName(): string {
    const numberBase: number = 36;
    const startIndex: number = 2;
    const endIndex: number = 10;

    return Math.random().toString(numberBase).substring(startIndex, endIndex);
  }

}
