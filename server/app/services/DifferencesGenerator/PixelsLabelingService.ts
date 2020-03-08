import {Color} from "../../../../common/Color";
import {Coordinate} from "../../../../common/Coordinate";
import {Pixel} from "../../../../common/Pixel";
import {Const24BMP} from "./Const24BMP";
import {CoordinateConverter} from "./CoordConverter";
import {DifferencesData} from "./DifferencesData";

export class PixelsLabelingService {

    public readonly originalImageBuffer: Buffer;
    public readonly differencesBuffer: Buffer;
    public readonly OFFSET: number;

    public differencesPixelSet: Set<Pixel> = new Set<Pixel>();
    public diffData: DifferencesData;

    public constructor( differencesImageBuffer: Buffer, originalImageBuffer: Buffer) {

        this.differencesBuffer = differencesImageBuffer;
        this.OFFSET = this.differencesBuffer[Const24BMP.OFFSET_INDEX];
        this.originalImageBuffer = originalImageBuffer;
        this.diffData = new DifferencesData();

        this.fillDifferencesPixelSet();
        this.labelPixels();

        if ( this.contains7Differences()) {
            this.diffData.groupPixelsByLabel();
        }

    }
    /**
     *
     */
    public labelPixels(): void {

        let label: number = 0;

        this.differencesPixelSet.forEach((pixel: Pixel) => {

            pixel.label = label;
            pixel.color = this.getPixelOriginalColor(pixel.index);
            this.diffData.labeledPixelsMap.set(pixel.index, pixel);
            this.differencesPixelSet.delete(pixel);
            this.addNeighbours(label, pixel);
            label++;

        });
        this.diffData.contains7Differences = label === Const24BMP.MAX_DIFFERENCES;
    }
    /**
     *
     * @param label
     * @param pixel
     */
    public addNeighbours(label: number, pixel: Pixel): void {

        const neighboursInDifferencesSet: Set<Pixel> = this.getNeighboursInDifferencesPixelSet(pixel);

        neighboursInDifferencesSet.forEach((pix: Pixel) => {
            pix.label = label;
            pix.color = this.getPixelOriginalColor(pix.index);
            this.diffData.labeledPixelsMap.set(pix.index, pix);
            this.addNeighbours(label, pix);
        });
    }
    /**
     *
     * @param pixel
     */
    public getNeighboursInDifferencesPixelSet(pixel: Pixel): Set<Pixel> {

        const neighboursPixelSet: Set<Pixel> = this.getNeighboursPixelSet(pixel);

        const neighboursFoundInBlackSet: Set<Pixel> = new Set();
        neighboursPixelSet.forEach( (pix: Pixel) => {
            if (this.isInDifferencesPixelSet(pix)) {
                neighboursFoundInBlackSet.add(pix);
            }
        });

        return neighboursFoundInBlackSet;
    }
    /**
     *
     * @param pixel
     */
    public isInDifferencesPixelSet(pixel: Pixel): boolean {

        let isNeighbourIn: boolean = false;
        const x: number = pixel.coordinate.x;
        const y: number = pixel.coordinate.y;

        this.differencesPixelSet.forEach( (pix: Pixel) => {
            if ( pix.coordinate.x === x && pix.coordinate.y === y ) {
                this.differencesPixelSet.delete(pix);
                isNeighbourIn = true;
            }
        });

        return isNeighbourIn;
    }
    /**
     *
     * @param pixel
     */
    public getNeighboursPixelSet(pixel: Pixel): Set<Pixel> {

        const initialX: number = pixel.coordinate.x;
        const initialY: number = pixel.coordinate.y;
        const notLabeledYet: number = -1;

        const N:    Pixel  = this.createPixel(initialX,     initialY + 1, notLabeledYet, Const24BMP.BLACK);
        const NE:   Pixel  = this.createPixel(initialX + 1, initialY + 1, notLabeledYet, Const24BMP.BLACK);
        const E:    Pixel  = this.createPixel(initialX + 1, initialY    , notLabeledYet, Const24BMP.BLACK);
        const SE:   Pixel  = this.createPixel(initialX + 1, initialY - 1, notLabeledYet, Const24BMP.BLACK);
        const S:    Pixel  = this.createPixel(initialX,     initialY - 1, notLabeledYet, Const24BMP.BLACK);
        const SW:   Pixel  = this.createPixel(initialX - 1, initialY - 1, notLabeledYet, Const24BMP.BLACK);
        const W:    Pixel  = this.createPixel(initialX - 1, initialY    , notLabeledYet, Const24BMP.BLACK);
        const NW:   Pixel  = this.createPixel(initialX - 1, initialY + 1, notLabeledYet, Const24BMP.BLACK);

        return new Set([ N, NE, E, SE, S, SW, W, NW ]);
    }
    /**
     *
     */
    public fillDifferencesPixelSet(): void {

        for (let y: number = 0; y < Const24BMP.HEIGHT; y++) {
            for (let x: number = 0; x < Const24BMP.WIDTH; x++) {

                if (this.isSameColor(x, y, Const24BMP.BLACK)) {

                    const notLabeledYet: number = -1;
                    const pixel: Pixel = this.createPixel( x, y, notLabeledYet, Const24BMP.BLACK);
                    this.differencesPixelSet.add(pixel);

                }
            }
        }
    }
    /**
     * @param x
     * @param y
     * @param label
     * @param color
     */
    public createPixel(x: number, y: number, label: number, color: Color): Pixel {

        const pixelIndex: number = CoordinateConverter.coordinateToStartIndex(x, y, this.OFFSET);
        const coordinate: Coordinate = { x: x, y: y};

        return {coordinate: coordinate, index: pixelIndex, label: label, color: color};
    }
    /**
     *
     * @param x
     * @param y
     * @param color
     */
    public isSameColor(x: number, y: number, color: Color): boolean {

        const pixelIndex: number = CoordinateConverter.coordinateToStartIndex( x, y, this.OFFSET);

        const isSameRed: boolean = this.differencesBuffer[pixelIndex + Const24BMP.RED_OFFSET] === color.red;
        const isSameGreen: boolean = this.differencesBuffer[pixelIndex + Const24BMP.GREEN_OFFSET] === color.green;
        const isSameBlue: boolean = this.differencesBuffer[pixelIndex + Const24BMP.BLUE_OFFSET] === color.blue;

        return isSameRed && isSameGreen && isSameBlue;
    }
    /**
     *
     * @param pixelIndex
     *
     */
    public getPixelOriginalColor(pixelIndex: number): Color {

        const redValue: number   = this.originalImageBuffer[pixelIndex + Const24BMP.RED_OFFSET];
        const greenValue: number = this.originalImageBuffer[pixelIndex + Const24BMP.GREEN_OFFSET];
        const blueValue: number  = this.originalImageBuffer[pixelIndex + Const24BMP.BLUE_OFFSET];

        return {red: redValue, green: greenValue, blue: blueValue};
    }

    public contains7Differences(): boolean {
        return this.diffData.contains7Differences;
    }
}
