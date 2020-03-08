import {ElementRef} from "@angular/core";
import {OneVsOne} from "../../../common/OneVsOne";

export interface FreeMultiPlayerGame {
  game: OneVsOne;
  canvasOriginal: ElementRef<HTMLCanvasElement>;
  gameView: ElementRef<HTMLDivElement>;
  error: ElementRef<HTMLDivElement>;
}
