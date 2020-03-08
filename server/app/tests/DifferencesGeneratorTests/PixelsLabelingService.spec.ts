import { assert } from "chai";
import * as path from "path";
import {CoordinateConverter as convert} from "../../services/DifferencesGenerator/CoordConverter";
import {ImageDifferencesGenerator} from "../../services/DifferencesGenerator/ImageDifferencesGenerator";
import {PixelsLabelingService} from "../../services/DifferencesGenerator/PixelsLabelingService";

const originalImage: string  = path.resolve(__dirname, "imagesTest/imgOrg.bmp");
const modifiedImage: string = path.resolve(__dirname, "imagesTest/7diff.bmp");
const generator: ImageDifferencesGenerator = new ImageDifferencesGenerator(originalImage, modifiedImage);

const labeledPix: PixelsLabelingService = new PixelsLabelingService(generator.differencesBuffer, generator.originalImgBuffer);

const x: number = 238;
const y: number = 353;
const index: number = convert.coordinateToStartIndex(x, y, labeledPix.OFFSET);

describe("size of the map", () => {

    it ("should be of 4484", () => {

        const actualResult: number = labeledPix.diffData.labeledPixelsMap.size;
        const expectedResult: number = 4484;
        assert.equal(actualResult, expectedResult);
    });
});

describe("labeledPixelsMap", () => {

    it ("should contain the key index 678596;", () => {

        const expectedIndex: number = 678596;
        const actualResult: boolean = labeledPix.diffData.labeledPixelsMap.has(expectedIndex);
        const expectedResult: boolean = true;
        assert.equal(actualResult, expectedResult);
    });
});

describe("the pixel at the index 678596", () => {

    it ("should be the expected Color", () => {

        const expectedRed: number = 154;
        const expectedGreen: number = 123;
        const expectedBlue: number = 68;

        // @ts-ignore "Object is possibly undefined" shouldn't happen within tests
        const isExpectedRed: boolean = labeledPix.diffData.labeledPixelsMap.get(index).color.red === expectedRed;
        // @ts-ignore
        const isExpectedGreen: boolean = labeledPix.diffData.labeledPixelsMap.get(index).color.green === expectedGreen;
        // @ts-ignore
        const isExpectedBlue: boolean = labeledPix.diffData.labeledPixelsMap.get(index).color.blue === expectedBlue;

        const isExpectedColor: boolean = isExpectedRed && isExpectedGreen && isExpectedBlue;

        assert.equal(isExpectedColor, true);
    });

    it ("should have Label = 3", () => {

        const expectedLabel: number = 3;
        // @ts-ignore
        const isSameLabel: boolean = labeledPix.diffData.labeledPixelsMap.get(index).label === expectedLabel;

        assert.equal(isSameLabel, true);
    });

    it ("should have the coordinates: x = 238, y = 353", () => {

        const expectedX: number = 238;
        const expectedY: number = 353;
        // @ts-ignore
        const isSameX: boolean = labeledPix.diffData.labeledPixelsMap.get(index).coordinate.x === expectedX;
        // @ts-ignore
        const isSameY: boolean = labeledPix.diffData.labeledPixelsMap.get(index).coordinate.y === expectedY;

        const areSameCoordinates: boolean = isSameX && isSameY;
        assert.equal(areSameCoordinates, true);
    });
});

describe("differencesPixelSet", () => {

    it ("should be empty", () => {

        const actualResult: number = labeledPix.differencesPixelSet.size;
        const expectedResult: number = 0;
        assert.equal(actualResult, expectedResult);
    });
});
