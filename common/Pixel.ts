import { Coordinate } from "./Coordinate";
import { Color } from "./Color";

export interface Pixel{

    coordinate: Coordinate;
    index: number;
    label: number;
    color: Color;
    
}