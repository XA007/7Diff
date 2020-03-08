export class FreeGameConst {
  public static readonly MIN_QUANTITY: number = 10;
  public static readonly MAX_QUANTITY: number = 200;
  public static readonly MIN_NAME_LENGTH: number = 4;
  public static readonly MAX_NAME_LENGTH: number = 15;
  public static readonly MODIFICATIONS: number = 7;
  public static readonly Y_COORDINATES_MAX: number = 800;
  public static readonly Y_COORDINATES_MIN: number = 400;
  public static readonly Z_COORDINATES: number = -200;
  public static readonly ASPECT: number = window.innerWidth / window.innerHeight;
  public static readonly FRUSTUM_SIZE: number = 1000;
  public static readonly NEAR: number = 1;
  private static readonly TWO: number = 2;
  public static readonly WIDTH_RATIO: number = (FreeGameConst.FRUSTUM_SIZE * FreeGameConst.ASPECT / FreeGameConst.TWO);
  public static readonly HEIGHT_RATIO: number = (FreeGameConst.FRUSTUM_SIZE / FreeGameConst.TWO);
  public static readonly THETA: number = 0.1;
}
