import * as fs from "fs";
import {injectable} from "inversify";
import {Pixel} from "../../../common/Pixel";
import {PixelsLabelingService as PixelLabeling} from "./DifferencesGenerator/PixelsLabelingService";

export module SimpleViewDifference {

    @injectable()
    export class SimpleViewDifferenceService {

        public static createOffsetFile(offset: number, gameName: string): void {
            const object: Object = {};
            object["offset"] = offset;

            fs.writeFileSync("simpleGameMaps/" + gameName + "-offset.json", JSON.stringify(object), "utf-8");
        }

        public generatePixelsDiffAssets(labeledPixels: PixelLabeling, gameName: string): void {

            this.diffPixelsGroupToJSONFile(labeledPixels.diffData.differencesArraySets, gameName);
            this.diffPixelsMapToJSONFile(labeledPixels.diffData.labeledPixelsMap, gameName);
            SimpleViewDifference.SimpleViewDifferenceService.createOffsetFile(labeledPixels.OFFSET, gameName);

        }

        public diffPixelsMapToJSONFile(pixelsMap: Map<number, Pixel>, gameName: string): void {
            const filePath: string = "simpleGameMaps/" + gameName + "-maps.json";
            fs.writeFileSync(filePath, JSON.stringify(this.mapToObject(pixelsMap), null, 1), "utf-8");
        }

        public diffPixelsGroupToJSONFile(differencesArraySets: Set<Pixel>[], gameName: string): void {

            const pixelsSetJsonObject: Object = this.createJSONObject(differencesArraySets);
            const pixelsSetString: string = JSON.stringify(pixelsSetJsonObject, null, 1);
            const filePath: string = "simpleGameMaps/" + gameName + "-sets.json";
            fs.writeFileSync(filePath, pixelsSetString, "utf-8");

        }

        public createJSONObject(array: Set<Pixel>[]): Object {
            const object: Object = {};
            for (let index: number = 0; index < array.length; index++) {
                const val: Pixel[] = [];
                array[index].forEach((pixel: Pixel) => {
                    val.push(pixel);
                });
                object[index] = val;
            }

            return object;
        }

        public mapToObject(map: Map<number, Pixel>): Object {
            const object: Object = {};
            map.forEach( (val: Pixel, key: number) => {
                object[key] = val;
            });

            return object;
        }
    }
}
