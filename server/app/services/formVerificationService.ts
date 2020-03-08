import {ImageInfoConstants} from "./ImageInfoConstants";
import {BufferToArrayBufferService} from "./bufferToArrayBufferService";
import { ImageVerificationService } from "./imageVerificationService";

export class FormVerificationService {

  public constructor(private bufferToArrayBuffer: BufferToArrayBufferService) { }

  public verifyImageInfos(originalImageBuffer: Buffer, modifiedImageBuffer: Buffer): string {
    const originalImageArrayBuffer: ArrayBuffer = this.bufferToArrayBuffer.bufferToArrayBuffer(originalImageBuffer);
    const modifiedImageArrayBuffer: ArrayBuffer = this.bufferToArrayBuffer.bufferToArrayBuffer(modifiedImageBuffer);
    const code: boolean[] = [];

    code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_TYPE] = ImageVerificationService.isImageRightType(originalImageArrayBuffer);
    code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_WIDTH] = ImageVerificationService.isImageRightWidth(originalImageArrayBuffer);
    code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_HEIGHT] = ImageVerificationService.isImageRightHeight(originalImageArrayBuffer);
    code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_BIT_COUNT] = ImageVerificationService.isImageRightBitCount(originalImageArrayBuffer);
    code[ImageInfoConstants.MODIFIED_IMAGE_BAD_TYPE] = ImageVerificationService.isImageRightType(modifiedImageArrayBuffer);
    code[ImageInfoConstants.MODIFIED_IMAGE_BAD_WIDTH] = ImageVerificationService.isImageRightWidth(modifiedImageArrayBuffer);
    code[ImageInfoConstants.MODIFIED_IMAGE_BAD_HEIGHT] = ImageVerificationService.isImageRightHeight(modifiedImageArrayBuffer);
    code[ImageInfoConstants.MODIFIED_IMAGE_BAD_BIT_COUNT] = ImageVerificationService.isImageRightBitCount(modifiedImageArrayBuffer);

    return this.decodeErrorCode(code);
  }

  public decodeErrorCode(code: boolean[]): string {
      let errorMessage: string = "";
      if (!code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_TYPE]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.ORIGINAL_IMAGE_BAD_TYPE];
      }
      if (!code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_WIDTH]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.ORIGINAL_IMAGE_BAD_WIDTH];
      }
      if (!code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_HEIGHT]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.ORIGINAL_IMAGE_BAD_HEIGHT];
      }
      if (!code[ImageInfoConstants.ORIGINAL_IMAGE_BAD_BIT_COUNT]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.ORIGINAL_IMAGE_BAD_BIT_COUNT];
      }
      if (!code[ImageInfoConstants.MODIFIED_IMAGE_BAD_TYPE]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.MODIFIED_IMAGE_BAD_TYPE];
      }
      if (!code[ImageInfoConstants.MODIFIED_IMAGE_BAD_WIDTH]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.MODIFIED_IMAGE_BAD_WIDTH];
      }
      if (!code[ImageInfoConstants.MODIFIED_IMAGE_BAD_HEIGHT]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.MODIFIED_IMAGE_BAD_HEIGHT];
      }
      if (!code[ImageInfoConstants.MODIFIED_IMAGE_BAD_BIT_COUNT]) {
        errorMessage += ImageInfoConstants.ERROR_MESSAGES[ImageInfoConstants.MODIFIED_IMAGE_BAD_BIT_COUNT];
      }

      return errorMessage;
  }
}
