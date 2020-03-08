import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { GameInfoSenderService } from "./game-info-sender.service";

const GAME_NAME_LENGTH_ERROR_MESSAGE: string = "Game name must be between 4 & 15 characters. / \n";
const MISSING_FIELD_ERROR_MESSAGE: string = "There is a missing field in your form. Please try again.";

@Injectable({
  providedIn: "root",
})
export class SimpleGameCreationService {

  public constructor(
     private gameInfoSender: GameInfoSenderService) { }

  public static isMissingField(gameName: string, originalImage: File, modifiedImage: File): boolean {
    return ((gameName === undefined) || (originalImage === undefined) || (modifiedImage === undefined));
  }

  public static makeFormData(gameName: string, originalImage: File, modifiedImage: File): FormData {
    const formData: FormData = new FormData();
    formData.append("gameName", gameName);
    formData.append("originalImage", originalImage);
    formData.append("modifiedImage", modifiedImage);

    return formData;
  }

  public async triggerErrorOrSendData(gameName: string, originalImage: File, modifiedImage: File): Promise<string> {
    if (SimpleGameCreationService.isMissingField(gameName, originalImage, modifiedImage)) {
      return new Promise<string>((resolve) => {
        resolve(MISSING_FIELD_ERROR_MESSAGE);
      });
    }

    return this.addErrorMessageOrSendData(gameName, originalImage, modifiedImage);
  }

  public addErrorMessageOrSendData(gameName: string, originalImage: File, modifiedImage: File): Promise<string> {
    const formData: FormData = SimpleGameCreationService.makeFormData(gameName, originalImage, modifiedImage);

    return this.gameInfoSender.verifyForm(formData).then((message) => {
      message += this.addErrorMessageIfBadGameNameLength(gameName);
      this.submitFormAndGenerateGameCardIfErrorMessageEmpty(message, gameName, formData);

      return message;
    });
  }

  public addErrorMessageIfBadGameNameLength(gameName: string): string {
    const MIN_LENGTH: number = 4;
    const MAX_LENGTH: number = 15;

    return (gameName.length >= MIN_LENGTH && gameName.length <= MAX_LENGTH) ? "" : GAME_NAME_LENGTH_ERROR_MESSAGE;
  }

  public submitFormAndGenerateGameCardIfErrorMessageEmpty(errorMessage: string,
                                                          gameName: string,
                                                          formData: FormData): void {
    const ONE_SECOND: number = 1000;
    if (errorMessage === "") {
        this.gameInfoSender.generateDifferencesImage(formData).then((message) => {
          if (message === "Success") {
            setTimeout( () => {
              window.location.reload();
            },          ONE_SECOND);
          } else {
            Swal.fire({
              title: "<span style='font-family: Roboto, Arial, sans-serif'>Error!</span>",
              html: "<span style='font-family: Roboto, Arial, sans-serif'>" +
                "The game doesn't have 7 differences!</span>",
              type: "error",
            });
          }
        }).catch();
    }
  }
}
