import {GameCard} from "./Game-Card";
import {ImageAsset} from "./gameAssets/ImageAsset";

export interface GameAsset {
  gameCard: GameCard;
  originalImage: ImageAsset;
  modifiedImage: ImageAsset;
}
