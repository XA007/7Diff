import { assert } from "chai";
import * as fs from "fs";
import * as path from "path";
import {ImageDifferencesGenerator} from "../../services/DifferencesGenerator/ImageDifferencesGenerator";

describe("createBmpImage", () => {

    it ("should create a differences image", () => {
        const originalImage: string  = path.resolve(__dirname, "imagesTest/imgOrg.bmp");
        const modifiedImage: string = path.resolve(__dirname, "imagesTest/7diff.bmp");
        const generator: ImageDifferencesGenerator = new ImageDifferencesGenerator(originalImage, modifiedImage);
        generator.createBmpImage("createBmpTEST");

        const actualPath: string  = path.resolve(__dirname, "../../../uploads/createBMpTEST-differences.bmp");
        const expectedPath: string  = path.resolve(__dirname, "../../../uploads/expectedResult.bmp");

        const actualResult: Buffer = fs.readFileSync(actualPath);
        const expectedResult: Buffer = fs.readFileSync(expectedPath);
        const areSameBuffer: number = 0;
        assert.equal(actualResult.compare(expectedResult), areSameBuffer);
    });
});
