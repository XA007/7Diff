import {ElementRef} from "@angular/core";
import {OneVsOne} from "../../../common/OneVsOne";

export interface SimpleMultiplayerGame {
    game: OneVsOne;
    canvasOriginal: ElementRef<HTMLCanvasElement>;
    canvasModified: ElementRef<HTMLCanvasElement>;
    gameView: ElementRef<HTMLDivElement>;
    error: ElementRef<HTMLDivElement>;
}
