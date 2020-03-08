export class ImageInfoConstants {
public static readonly IMAGE_TYPE_OFFSET: number = 0;
public static readonly START_OFFSET: number = 10;
public static readonly IMAGE_WIDTH_OFFSET: number = 18;
public static readonly IMAGE_HEIGHT_OFFSET: number = 22;
public static readonly BIT_COUNT_OFFSET: number = 28;
public static readonly BMP_START_VALUE: number = 138;
public static readonly ORIGINAL_IMAGE_BAD_TYPE: number = 0;
public static readonly ORIGINAL_IMAGE_BAD_WIDTH: number = 1;
public static readonly ORIGINAL_IMAGE_BAD_HEIGHT: number = 2;
public static readonly ORIGINAL_IMAGE_BAD_BIT_COUNT: number = 3;
public static readonly MODIFIED_IMAGE_BAD_TYPE: number = 4;
public static readonly MODIFIED_IMAGE_BAD_WIDTH: number = 5;
public static readonly MODIFIED_IMAGE_BAD_HEIGHT: number = 6;
public static readonly MODIFIED_IMAGE_BAD_BIT_COUNT: number = 7;
public static readonly ERROR_MESSAGES: string[] = ["Original image is not .BMP / \n",
                                                   "Original image does not have width of 640 / \n",
                                                   "Original image does not have height of 480 / \n",
                                                   "Original image does not have bit count of 24 / \n",
                                                   "Modified image is not .BMP / \n",
                                                   "Modified image does not have width of 640 / \n",
                                                   "Modified image does not have height of 480 / \n",
                                                   "Modified image does not have bit count of 24 / \n"];

public static readonly RIGHT_TYPE: number = 19778;
public static readonly RIGHT_BIT_COUNT: number = 24;
public static readonly RIGHT_WIDTH: number = 640;
public static readonly RIGHT_HEIGHT: number = 480;
}
