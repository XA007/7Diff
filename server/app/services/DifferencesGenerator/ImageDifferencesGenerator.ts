import * as fs from "fs";
import {Color} from "../../../../common/Color";
import { Const24BMP } from "./Const24BMP";
import { CoordinateConverter } from "./CoordConverter";

export class ImageDifferencesGenerator {
    public originalImgBuffer: Buffer;
    public modifiedImgBuffer: Buffer;
    public differencesBuffer: Buffer;
    public OFFSET: number;
    /**
     *
     * @param imgOrgPath
     * @param imgDiffPath
     *
     */
    public constructor(imgOrgPath: string, imgDiffPath: string) {

        this.originalImgBuffer = fs.readFileSync(imgOrgPath);
        this.modifiedImgBuffer = fs.readFileSync(imgDiffPath);
        // initializing attributes
        this.OFFSET = this.originalImgBuffer[Const24BMP.OFFSET_INDEX];
        // building a buffer model based on the original image
        this.differencesBuffer = fs.readFileSync(imgOrgPath);
        // coloring and widening the differences
        this.colorDifferences(Const24BMP.BLACK);

    }

    /**
     *
     * @param gameName
     *
     */
    public createBmpImage(gameName: string): void {

        const filePath: string = "./uploads/" + gameName + "-differences" + Const24BMP.BMP_EXTENSION;
        fs.writeFileSync( filePath, this.differencesBuffer );

    }
    /**
     *
     * @param color
     *
     */
    public colorDifferences(color: Color): void {

        const size: number = this.originalImgBuffer.length;
        for (let i: number = this.OFFSET; i < size; i = i + Const24BMP.ELEMENTS_PER_PIXEL) {
            if (!this.isSamePixel(i)) {
                this.widenPixel(i, color);
            } else {
                this.colorPixel(i, Const24BMP.WHITE);
            }
        }
    }
    /**
     *
     * @param pixelIndex
     *
     */
    public isSamePixel(pixelIndex: number): boolean {

        const isSameRed: boolean = this.originalImgBuffer[pixelIndex + Const24BMP.RED_OFFSET] ===
                                   this.modifiedImgBuffer[pixelIndex + Const24BMP.RED_OFFSET] ;

        const isSameGreen: boolean = this.originalImgBuffer[pixelIndex + Const24BMP.GREEN_OFFSET] ===
                                     this.modifiedImgBuffer[pixelIndex + Const24BMP.GREEN_OFFSET];

        const isSameBlue: boolean = this.originalImgBuffer[pixelIndex + Const24BMP.BLUE_OFFSET] ===
                                    this.modifiedImgBuffer[pixelIndex + Const24BMP.BLUE_OFFSET];

        return isSameRed && isSameGreen && isSameBlue;
    }
    /**
     * @param pixelIndex
     * @param color
     */
    public widenPixel(pixelIndex: number, color: Color): void {
        /**
         *           step1             step2                 step3
         *            rW                 rL                    sS
         *           * * *             * * *                 * * *
         *           * * *             * * *               * * * * *
         *           * * *         * * * * * * *         * * * * * * *
         *        rL * O *      rW * * * O * * *      sS * * * O * * *
         *           * * *         * * * * * * *         * * * * * * *
         *           * * *             * * *               * * * * *
         *           * * *             * * *                 * * *
         */
        const rectangleWidth: number    = 1;
        const rectangleLength: number    = 3;
        const squareSide: number    = 2;
        // converting pixel index to XY coordinates
        const y: number = CoordinateConverter.indexToY(pixelIndex, this.OFFSET);
        const x: number = CoordinateConverter.indexToX(pixelIndex, y, this.OFFSET);
        // step1
        this.colorArea(color, x - rectangleWidth, x + rectangleWidth, y - rectangleLength, y + rectangleLength);
        // step2
        this.colorArea(color, x - rectangleLength, x + rectangleLength, y - rectangleWidth, y + rectangleWidth);
        // step3
        this.colorArea(color, x - squareSide, x + squareSide, y - squareSide, y + squareSide);
    }
    /**
     * @param color
     * @param xStart
     * @param xEnd
     * @param yStart
     * @param yEnd
     *
     */
    public colorArea(color: Color, xStart: number, xEnd: number, yStart: number, yEnd: number): void {

        for (let x: number = xStart; x < xEnd; x++) {
            for (let y: number = yStart; y < yEnd; y++) {

                const pixelIndex: number = CoordinateConverter.coordinateToStartIndex(x, y, this.OFFSET);
                this.colorPixel(pixelIndex, color);

            }
        }
    }
    /**
     * @param pixelIndex
     * @param color
     *
     */
    public colorPixel(pixelIndex: number, color: Color): void {

        this.differencesBuffer[pixelIndex + Const24BMP.BLUE_OFFSET]  = color.blue;
        this.differencesBuffer[pixelIndex + Const24BMP.GREEN_OFFSET] = color.green;
        this.differencesBuffer[pixelIndex + Const24BMP.RED_OFFSET]   = color.red;

    }
}
