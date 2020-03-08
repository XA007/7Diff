import {assert} from "chai";
import {readFileSync} from "fs";
import * as path from "path";
import {ImageDifferencesGenerator} from "../services/DifferencesGenerator/ImageDifferencesGenerator";
import {PixelsLabelingService} from "../services/DifferencesGenerator/PixelsLabelingService";
import {SimpleViewDifference} from "../services/simpleViewDifferenceService";

const simpleViewDifference: SimpleViewDifference.SimpleViewDifferenceService = new SimpleViewDifference.SimpleViewDifferenceService();

const originalImage: string  = path.resolve(__dirname, "./DifferencesGeneratorTests/imagesTest/imgOrg.bmp");
const modifiedImage: string = path.resolve(__dirname, "./DifferencesGeneratorTests/imagesTest/7diff.bmp");
const generator: ImageDifferencesGenerator = new ImageDifferencesGenerator(originalImage, modifiedImage);

const labeledPix: PixelsLabelingService = new PixelsLabelingService(generator.differencesBuffer, generator.originalImgBuffer);

describe("generatePixelsDiffAssets function", () => {

    it("should create 2 json files in \"simpleGameMaps/\"", () => {
        simpleViewDifference.generatePixelsDiffAssets(labeledPix, "generatePixelsDiffAssetsTEST");
        // assert.equal(1,1);
        const mapsPath: string  = path.resolve(__dirname, "../../SimpleGameMaps/generatePixelsDiffAssetsTEST-maps.json");
        const setsPath: string  = path.resolve(__dirname, "../../SimpleGameMaps/generatePixelsDiffAssetsTEST-maps.json");

        const mapsLengthEmpty: boolean = readFileSync(mapsPath).length <= 0;
        const setsLengthEmpty: boolean = readFileSync(setsPath).length <= 0;
        assert.equal(mapsLengthEmpty, false);
        assert.equal(setsLengthEmpty, false);
    });

});
