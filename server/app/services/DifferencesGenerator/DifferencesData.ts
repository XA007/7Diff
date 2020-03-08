import {Pixel} from "../../../../common/Pixel";
import {Const24BMP} from "./Const24BMP";

export class DifferencesData {

    public labeledPixelsMap: Map<number, Pixel>;
    public contains7Differences: boolean;
    public differencesArraySets: Set<Pixel>[];

    public constructor() {
        this.labeledPixelsMap = new Map<number, Pixel>();
        this.contains7Differences = false;
        this.differencesArraySets = DifferencesData.getArrayOfSevenEmptyPixelsSet();
    }

    public static getArrayOfSevenEmptyPixelsSet(): Set<Pixel>[] {
        const arr: Set<Pixel>[] = new Array<Set<Pixel>>();

        for (let i: number = 0; i < Const24BMP.MAX_DIFFERENCES; i++) {
            arr.push(new Set<Pixel>());
        }

        return arr;
    }

    public groupPixelsByLabel(): void {

        this.labeledPixelsMap.forEach((pixel: Pixel) => {
            this.differencesArraySets[pixel.label].add(pixel);
        });

    }
}
