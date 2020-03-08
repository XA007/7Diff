import {GameCard} from "./Game-Card";
import {ImageAsset} from "./gameAssets/ImageAsset";

export interface SimpleGameAssetsModel {
  gameCard: GameCard;
  originalImage: ImageAsset;
  modifiedImage: ImageAsset;
}
