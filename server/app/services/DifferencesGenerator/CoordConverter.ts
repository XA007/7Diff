import { Const24BMP } from "./Const24BMP";

export class CoordinateConverter {
    /**
     * @param x
     * @param y
     * @param offset
     * convert coordinate to pixel start array's index
     */
    public static coordinateToStartIndex(x: number, y: number, offset: number): number {

        return offset + x * Const24BMP.ELEMENTS_PER_PIXEL + y * Const24BMP.ELEMENTS_PER_ROW;
    }
    /**
     * @param index
     * @param y
     * @param offset
     */
    public static indexToX(index: number, y: number, offset: number): number {
        return (index - offset - ( y * Const24BMP.ELEMENTS_PER_ROW)) /
            Const24BMP.ELEMENTS_PER_PIXEL;
    }
    /**
     * @param index
     * @param offset
     */
    public static indexToY(index: number, offset: number): number {
        return Math.floor((index - offset) / Const24BMP.ELEMENTS_PER_ROW);
    }
}
