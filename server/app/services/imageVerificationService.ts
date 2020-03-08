import { ImageInfo } from "../../../common/communication/imageinfos";
import { ImageInfoConstants } from "./ImageInfoConstants";
import { ImageInfoService } from "./imageInfoService";

export class ImageVerificationService {

  public static isImageRightWidth(buffer: ArrayBuffer): boolean {
    const imageInfos: ImageInfo =  ImageInfoService.extractImageInfos(buffer);

    return ImageVerificationService.isWidthRightWidth(imageInfos.imageWidth);
  }

  public static isImageRightHeight(buffer: ArrayBuffer): boolean {
    const imageInfos: ImageInfo =  ImageInfoService.extractImageInfos(buffer);

    return ImageVerificationService.isHeightRightHeight(imageInfos.imageHeight);
  }

  public static isImageRightType(buffer: ArrayBuffer): boolean {
    const imageInfos: ImageInfo =  ImageInfoService.extractImageInfos(buffer);

    return ImageVerificationService.isTypeRightType(imageInfos.imageType);
  }

  public static isImageRightBitCount(buffer: ArrayBuffer): boolean {
    const imageInfos: ImageInfo =  ImageInfoService.extractImageInfos(buffer);

    return ImageVerificationService.isBitCountRightBitCount(imageInfos.bitCount);
  }

  public static isTypeRightType(imageType: number): boolean {
    return imageType === ImageInfoConstants.RIGHT_TYPE;
  }

  public static isWidthRightWidth(imageWidth: number): boolean {
    return imageWidth === ImageInfoConstants.RIGHT_WIDTH;
  }

  public static isHeightRightHeight(imageHeight: number): boolean {
    return imageHeight === ImageInfoConstants.RIGHT_HEIGHT;
  }

  public static isBitCountRightBitCount(imageBitCount: number): boolean {
    return imageBitCount === ImageInfoConstants.RIGHT_BIT_COUNT;
  }
}
