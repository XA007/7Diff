import { assert } from "chai";
import {CoordinateConverter} from "../../services/DifferencesGenerator/CoordConverter";

describe("coordinateToStartIndex", () => {

    it ("should return 678596 for x: 238 and y: 353 with an offset of 122", () => {
        const x: number = 238;
        const y: number = 353;
        const offset: number = 122;
        const actualResult: number = CoordinateConverter.coordinateToStartIndex(x, y, offset);
        const expectedResult: number = 678596;
        assert.equal(actualResult, expectedResult);
    });
});

describe("indexToX", () => {

    it ("should return 238 for y: 353 and an index of 678596 with an offset of 122", async() => {
        const y: number = 353;
        const index: number = 678596;
        const offset: number = 122;
        const actualResult: number = CoordinateConverter.indexToX(index, y, offset);
        const expectedResult: number = 238;
        assert.equal(actualResult, expectedResult);
    });
});

describe("indexToY", () => {

    it ("should return 353 for an index of 678596 with an offset of 122", async() => {

        const index: number = 678596;
        const offset: number = 122;
        const actualResult: number = CoordinateConverter.indexToY(index, offset);
        const expectedResult: number = 353;
        assert.equal(actualResult, expectedResult);
    });
});
