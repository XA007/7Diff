import { assert } from "chai";
import * as fs from "fs";
import {ImageInfo} from "../../../common/communication/imageinfos";
import {BufferToArrayBufferService} from "../services/bufferToArrayBufferService";
import { ImageInfoService } from "../services/imageInfoService";

describe("extractImageInfos function", async () => {

  const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
  const jpegUint8Array: Uint8Array = new Uint8Array([]);
  const DELIMITER: string = process.platform.indexOf("win") === 0 ? "\\" : "/";

  it("Should return images data with bmp image data", () => {
    fs.readFile(__dirname + DELIMITER + "../../images/rightImage.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const RIGHT_BIT_COUNT: number = 24;
      const RIGHT_WIDTH: number = 640;
      const RIGHT_HEIGHT: number = 480;
      const RIGHT_TYPE: number = 19778;
      const BMP_START_VALUE: number = 138;
      const bmpImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      const bmpUint8Array: Uint8Array = new Uint8Array(bmpImageArrayBuffer, BMP_START_VALUE);
      const imageInfos: ImageInfo = ImageInfoService.extractImageInfos(bmpImageArrayBuffer);
      assert.equal(imageInfos.bitCount, RIGHT_BIT_COUNT);
      assert.equal(imageInfos.imageWidth, RIGHT_WIDTH);
      assert.equal(imageInfos.imageHeight, RIGHT_HEIGHT);
      assert.equal(imageInfos.imageType, RIGHT_TYPE);
      assert.equal(imageInfos.pixels.byteLength, bmpUint8Array.byteLength);
    });
  });

  it("Should return images data with jpeg image data", () => {
    fs.readFile(__dirname + DELIMITER + "/../../images/wrongType.jpg", (error: NodeJS.ErrnoException, data: Buffer) => {
      const JPEG_BIT_COUNT: number = 2829;
      const JPEG_IMAGE_WIDTH: number = 3690921984;
      const JPEG_IMAGE_HEIGHT: number = 234898176;
      const JPEG_IMAGE_TYPE: number = 55551;
      const jpegImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      const imageInfos: ImageInfo = ImageInfoService.extractImageInfos(jpegImageArrayBuffer);
      assert.equal(imageInfos.bitCount, JPEG_BIT_COUNT);
      assert.equal(imageInfos.imageWidth, JPEG_IMAGE_WIDTH);
      assert.equal(imageInfos.imageHeight, JPEG_IMAGE_HEIGHT);
      assert.equal(imageInfos.imageType, JPEG_IMAGE_TYPE);
      assert.equal(imageInfos.pixels.byteLength, jpegUint8Array.byteLength);
    });
  });
});
