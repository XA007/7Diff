import {ImageInfo} from "../../../common/communication/imageinfos";
import {ImageInfoConstants} from "./ImageInfoConstants";

export class ImageInfoService {

  public static extractImageInfos(buffer: ArrayBuffer): ImageInfo {
    const dataView: DataView = new DataView(buffer);
    const imageType: number = dataView.getUint16(ImageInfoConstants.IMAGE_TYPE_OFFSET, true);
    const start: number = dataView.getUint32(ImageInfoConstants.START_OFFSET, true);
    const imageWidth: number = dataView.getUint32(ImageInfoConstants.IMAGE_WIDTH_OFFSET, true);
    const imageHeight: number = dataView.getUint32(ImageInfoConstants.IMAGE_HEIGHT_OFFSET, true);
    const bitCount: number = dataView.getUint16(ImageInfoConstants.BIT_COUNT_OFFSET, true);
    let pixels: Uint8Array;
    (start === ImageInfoConstants.BMP_START_VALUE) ? (pixels = new Uint8Array(buffer, start)) : (pixels = new Uint8Array([]));

    return {imageType: imageType, bitCount: bitCount, imageWidth: imageWidth, imageHeight: imageHeight, pixels: pixels};
  }
}
