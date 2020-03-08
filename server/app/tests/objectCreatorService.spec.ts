import { assert } from "chai";
import * as THREE from "three";
import {ObjectCreatorService} from "../services/objectCreatorService";

describe("ObjectCreatorService", () => {
  const objectCreator: ObjectCreatorService = new ObjectCreatorService();

  it("should return random position in range on randomPositionX", () => {
    const MIN: number = -2000;
    const MAX: number = 0;
    assert.isAbove(objectCreator.randomPositionX(), MIN);
    assert.isBelow(objectCreator.randomPositionX(), MAX);
  });

  it("should return random position in range on randomPositionY", () => {
    const MIN: number = -1000;
    const MAX: number = 1000;
    assert.isAbove(objectCreator.randomPositionY(), MIN);
    assert.isBelow(objectCreator.randomPositionY(), MAX);
  });

  it("should return random rotation in range on randomObjectRotation", () => {
    const MIN: number = 0;
    const FACTOR: number = 2;
    const MAX: number = FACTOR * Math.PI;
    assert.isAbove(objectCreator.randomObjectRotation(), MIN);
    assert.isBelow(objectCreator.randomObjectRotation(), MAX);
  });

  it("should return random color in range on randomColor", () => {
    const MIN: number = 0x000000;
    const MAX: number = 0xFFFFFF;
    assert.isAbove(objectCreator.randomColor(), MIN);
    assert.isBelow(objectCreator.randomColor(), MAX);
  });

  it("should return random size in range on randomSize", () => {
    const MIN: number = 0;
    const MAX: number = 2;
    assert.isAbove(objectCreator.randomSize(), MIN);
    assert.isBelow(objectCreator.randomSize(), MAX);
  });

  it("should return random object type in range on randomObjectType", () => {
    const MIN: number = 0;
    const MAX: number = 6;
    assert.isAtLeast(objectCreator.randomObjectType(), MIN);
    assert.isBelow(objectCreator.randomObjectType(), MAX);
  });

  it("should return three geometry when randomSizeGeometryObject is called", () => {
    assert.typeOf(objectCreator.randomSizeGeometryObject(), "Object");
  });

  it("should return random size cube when randomSizeCube is called", () => {
    assert.typeOf(objectCreator.randomSizeCube(), "Object");
  });

  it("should return random size cylinder when randomSizeCylinder is called", () => {
    assert.typeOf(objectCreator.randomSizeCylinder(), "Object");
  });

  it("should return random size sphere when randomSizeSphere is called", () => {
    assert.typeOf(objectCreator.randomSizeSphere(), "Object");
  });

  it("should return random size Cone when randomSizeCone is called", () => {
    assert.typeOf(objectCreator.randomSizeCone(), "Object");
  });

  it("should return random size Pyramid when randomSizePyramid is called", () => {
    assert.typeOf(objectCreator.randomSizePyramid(), "Object");
  });

  it("should mesh array when createObjects is called", () => {
    const OBJECT_NUMBER: number = 69;
    const objects: THREE.Object3D[] = objectCreator.createObjects(OBJECT_NUMBER);
    for (const object of objects) {
      assert.typeOf(object, "Object");
    }
  });
});
