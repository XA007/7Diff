import {Color} from "../../../../common/Color";

export class Const24BMP {

    public static readonly OFFSET_INDEX: /**********/ number = 10;
    public static readonly ELEMENTS_PER_PIXEL: /****/ number = 3;
    public static readonly WIDTH: /*****************/ number = 640;
    public static readonly ELEMENTS_PER_ROW: /******/ number = Const24BMP.WIDTH * Const24BMP.ELEMENTS_PER_PIXEL;
    public static readonly HEIGHT: /****************/ number = 480;

    public static readonly BLUE_OFFSET: /***********/ number = 0;
    public static readonly GREEN_OFFSET: /**********/ number = 1;
    public static readonly RED_OFFSET: /************/ number = 2;

    public static readonly BLACK: /*****************/ Color  = { red: 0, green: 0, blue: 0 };
    public static readonly WHITE: /*****************/ Color  = { red: 255, green: 255, blue: 255};
    public static readonly RED: /*******************/ Color  = { red: 255, green: 0, blue: 0};

    public static readonly MAX_DIFFERENCES: /*******/ number = 7;
    public static readonly BMP_EXTENSION: /*********/ string = ".bmp";

}
