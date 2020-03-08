import { assert, expect } from "chai";
import * as fs from "fs";
import {BufferToArrayBufferService} from "../services/bufferToArrayBufferService";
import {FormVerificationService} from "../services/formVerificationService";

export const delimiter: string = process.platform.indexOf("win") === 0 ? "\\" : "/";

describe("decodeErrorCode function", async () => {
  const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
  const formVerification: FormVerificationService = new FormVerificationService(bufferToArrayBuffer);

  it("Should return empty string when boolean array is all false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, true, true, true, true, true]),
                 "");
  });

  it("Should return Original image is not .BMP when code[0] is false", () => {
    assert.equal(formVerification.decodeErrorCode([false, true, true, true, true, true, true, true]),
                 "Original image is not .BMP / \n");
  });

  it("Should return Original image does not have width of 640 when code[1] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, false, true, true, true, true, true, true]),
                 "Original image does not have width of 640 / \n");
  });

  it("Should return Original image does not have height of 480 when code[2] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, false, true, true, true, true, true]),
                 "Original image does not have height of 480 / \n");
  });

  it("Should return Original image does not have bit count of 24 when code[3] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, false, true, true, true, true]),
                 "Original image does not have bit count of 24 / \n");
  });

  it("Should return Modified image is not .BMP when code[4] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, true, false, true, true, true]),
                 "Modified image is not .BMP / \n");
  });

  it("Should return Modified image does not have width of 640 when code[5] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, true, true, false, true, true]),
                 "Modified image does not have width of 640 / \n");
  });

  it("Should return Modified image does not have height of 480 when code[6] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, true, true, true, false, true]),
                 "Modified image does not have height of 480 / \n");
  });

  it("Should return Modified image does not have bit count of 24 when code[7] is false", () => {
    assert.equal(formVerification.decodeErrorCode([true, true, true, true, true, true, true, false]),
                 "Modified image does not have bit count of 24 / \n");
  });
});

describe("verifyImageInfos function", async () => {
  const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
  const formVerification: FormVerificationService = new FormVerificationService(bufferToArrayBuffer);

  it("Should return Original image is not .BMP and Modified image is not .BMP when passed 2 jpeg images", () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongType.jpg", (error: NodeJS.ErrnoException, jpegImage: Buffer) => {
      expect(formVerification.verifyImageInfos(jpegImage, jpegImage)).to.include("Original image is not .BMP / \n");
      expect(formVerification.verifyImageInfos(jpegImage, jpegImage)).to.include("Modified image is not .BMP / \n");
    });
  });

  it("Should return Original image does not have width of 640 " +
      "and Modified image does not have width of 640 when passed 2 bad width images",
     () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongWidth.bmp", (error: NodeJS.ErrnoException, wrongWidthImage: Buffer) => {
      expect(formVerification.verifyImageInfos(wrongWidthImage, wrongWidthImage))
          .to.include("Original image does not have width of 640 / \n");
      expect(formVerification.verifyImageInfos(wrongWidthImage, wrongWidthImage))
          .to.include("Modified image does not have width of 640 / \n");
    });
  });

  it("Should return Original image does not have height of 480 " +
      "and Modified image does not have height of 480 when passed 2 bad height images",
     () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongHeight.bmp", (error: NodeJS.ErrnoException, wrongHeightImage: Buffer) => {
      expect(formVerification.verifyImageInfos(wrongHeightImage, wrongHeightImage))
          .to.include("Original image does not have height of 480 / \n");
      expect(formVerification.verifyImageInfos(wrongHeightImage,  wrongHeightImage))
          .to.include("Modified image does not have height of 480 / \n");
    });
  });

  it("Should return Original image does not have bit count of 24 " +
      "and Modified image does not have bit count of 24 when passed 2 bad bit count images",
     () => {
    fs.readFile(__dirname + delimiter + "/../../images/wrongBitCount.bmp", (error: NodeJS.ErrnoException, wrongBitCountImage: Buffer) => {
      expect(formVerification.verifyImageInfos(wrongBitCountImage, wrongBitCountImage))
          .to.include("Original image does not have bit count of 24 / \n");
      expect(formVerification.verifyImageInfos(wrongBitCountImage, wrongBitCountImage))
          .to.include("Modified image does not have bit count of 24 / \n");
    });
  });

  it("Should return empty string when passed original rightImage and modified rightImage", () => {
    fs.readFile(__dirname + delimiter + "/../../images/rightImage.bmp", (error: NodeJS.ErrnoException, rightImage: Buffer) => {
      expect(formVerification.verifyImageInfos(rightImage, rightImage))
          .to.equal("");
      expect(formVerification.verifyImageInfos(rightImage, rightImage))
          .to.equal("");
    });
  });
});
