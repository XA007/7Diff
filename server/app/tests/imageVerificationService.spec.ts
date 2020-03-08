import { assert } from "chai";
import * as fs from "fs";
import {BufferToArrayBufferService} from "../services/bufferToArrayBufferService";
import {ImageVerificationService} from "../services/imageVerificationService";

export const delimiter: string = process.platform.indexOf("win") === 0 ? "\\" : "/";

describe("imageVerificationService", async () => {

  const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
  const BAD_VALUE: number = 6969;
  const RIGHT_TYPE: number = 19778;
  const RIGHT_WIDTH: number = 640;
  const RIGHT_HEIGHT: number = 480;
  const RIGHT_BIT_COUNT: number = 24;

  it("should return true with right type on isTypeRightType", () => {
     assert.isTrue(ImageVerificationService.isTypeRightType(RIGHT_TYPE));
  });

  it("should return false with bad type on isTypeRightType", () => {
    assert.isFalse(ImageVerificationService.isTypeRightType(BAD_VALUE));
  });

  it("should return true with right width on isWidthRightWidth", () => {
    assert.isTrue(ImageVerificationService.isWidthRightWidth(RIGHT_WIDTH));
  });

  it("should return false with bad width on isWidthRightWidth", () => {
    assert.isFalse(ImageVerificationService.isWidthRightWidth(BAD_VALUE));
  });

  it("should return true with right height on isHeightRightHeight", () => {
    assert.isTrue(ImageVerificationService.isHeightRightHeight(RIGHT_HEIGHT));
  });

  it("should return false with bad height on isHeightRightHeight", () => {
    assert.isFalse(ImageVerificationService.isHeightRightHeight(BAD_VALUE));
  });

  it("should return true with right bit count on isBitCountRightBitCount", () => {
    assert.isTrue(ImageVerificationService.isBitCountRightBitCount(RIGHT_BIT_COUNT));
  });

  it("should return false with bad bit count on isBitCountRightBitCount", () => {
    assert.isFalse(ImageVerificationService.isBitCountRightBitCount(BAD_VALUE));
  });

  it("should return true with bmp image on isImageRightType", () => {
    fs.readFile(__dirname + delimiter + "/../../images/rightImage.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const rightImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isTrue(ImageVerificationService.isImageRightType(rightImageArrayBuffer));
    });
  });

  it("should return false with jpeg image on isImageRightType", () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongType.jpg", (error: NodeJS.ErrnoException, data: Buffer) => {
      const jpegImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isFalse(ImageVerificationService.isImageRightType(jpegImageArrayBuffer));
    });
  });

  it("should return true with right width image on isImageRightWidth", () => {
    fs.readFile(__dirname + delimiter + "/../../images/rightImage.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const rightImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isTrue(ImageVerificationService.isImageRightWidth(rightImageArrayBuffer));
    });
  });

  it("should return false with bad width image on isImageRightWidth", () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongWidth.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const wrongWidthImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isFalse(ImageVerificationService.isImageRightWidth(wrongWidthImageArrayBuffer));
    });
  });

  it("should return true with right height image on isImageRightHeight", () => {
    fs.readFile(__dirname + delimiter + "/../../images/rightImage.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const rightImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isTrue(ImageVerificationService.isImageRightHeight(rightImageArrayBuffer));
    });
  });

  it("should return false with bad height image on isImageRightHeight", () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongHeight.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const wrongHeightImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isFalse(ImageVerificationService.isImageRightHeight(wrongHeightImageArrayBuffer));
    });
  });

  it("should return true with right bit count image on isImageRightBitCount", () => {
    fs.readFile(__dirname + delimiter + "/../../images/rightImage.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const rightImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isTrue(ImageVerificationService.isImageRightBitCount(rightImageArrayBuffer));
    });
  });

  it("should return false with bad bit count image on isImageRightBitCount", () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongBitCount.bmp", (error: NodeJS.ErrnoException, data: Buffer) => {
      const wrongBitCountImageArrayBuffer: ArrayBuffer = bufferToArrayBuffer.bufferToArrayBuffer(data);
      assert.isFalse(ImageVerificationService.isImageRightBitCount(wrongBitCountImageArrayBuffer));
    });
  });
});
