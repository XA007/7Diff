import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SoundService {

  private readonly _winClick: string = "winClick";
  private readonly _wrongClick: string = "badClick";
  private readonly _applause: string = "applause";
  private readonly _youLost: string = "ohHellNo";

  public winClick(): void { this.playSoundOf(this._winClick); }

  public wrongClick(): void { this.playSoundOf(this._wrongClick); }

  public applause(): void { this.playSoundOf(this._applause); }

  public youLost(): void { this.playSoundOf(this._youLost); }

  /**
   *
   * @param soundName
   * take the name of a mp3 available in ../../assets/sounds/ directory
   * Do not include the extension just the name
   */
  private playSoundOf(soundName: string): void {

    const path: string = "../assets/sounds/" + soundName + ".mp3";
    const successSound: HTMLAudioElement = new Audio(path);
    successSound.play().catch((onRejection) => console.error(onRejection) );

  }
}
