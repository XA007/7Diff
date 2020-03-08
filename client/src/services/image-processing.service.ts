import {Injectable} from "@angular/core";
import {Color} from "../../../common/Color";
import {Coordinate} from "../../../common/Coordinate";

@Injectable({
  providedIn: "root",
})
export class ImageProcessingService {

  public readonly WIDTH: number = 640;
  public readonly HEIGHT: number = 480;

  /**
   *
   * @param imageUrl
   * @param canvas
   * Draw Image on the canvas.
   */
  public drawImage( imageUrl: string,
                    canvas: HTMLCanvasElement): void {
    // Getting the context
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // creating a new ImageElement
    const image: HTMLImageElement = new Image();
    // constructing the right path with the given ImageName
    image.src = imageUrl;
    // rendering the image on the given canvas
    image.onload = () => {
      // Defining the height and width of the canvas
      canvas.height = this.HEIGHT;
      canvas.width = this.WIDTH;
      ctx.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
    };
  }

  /**
   *
   * @param context
   * @param coordinate
   * @param color
   */
  public restorPixels(context: CanvasRenderingContext2D, coordinate: Coordinate, color: Color): void {

    context.fillStyle = "rgb(" + color.red + "," + color.green + "," + color.blue + ")";
    const width: number = 1;
    const height: number = 1;
    context.fillRect(coordinate.x, coordinate.y, width, height);

  }

}
