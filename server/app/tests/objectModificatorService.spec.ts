import {assert} from "chai";
import * as THREE from "three";
import {ObjectCreatorService} from "../services/objectCreatorService";
import {ObjectModificatorService} from "../services/objectModificatorService";

describe("EncodeBase64Service", () => {
  const objectCreator: ObjectCreatorService = new ObjectCreatorService();
  const objectModificator: ObjectModificatorService = new ObjectModificatorService(objectCreator);

  it("should modifyObjects when modifyObjectArray is called", () => {
    const objectArray: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 10;
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      objectArray.push(new THREE.Object3D());
    }
    const modifiedObjectArray: THREE.Object3D[] =
        objectModificator.modifyObjectArray(objectArray, ["ADD_OBJECT", "REMOVE_OBJECT"]);
    for (const object of modifiedObjectArray) {
      assert.typeOf(object, "Object");
    }
  });

  it("should remove an object when applyRemoveModification is called", () => {
    const objectArray: THREE.Object3D[] = [];
    const visitedObjects: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 10;
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      objectArray.push(new THREE.Object3D());
    }
    ObjectModificatorService.applyRemoveModification(objectArray, visitedObjects);
    assert.isBelow(objectArray.length, OBJECT_NUMBER);
  });

  it("should clone an array when cloneObjects is called", () => {
    const objectArray: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 10;
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      objectArray.push(new THREE.Object3D());
    }
    const newArray: THREE.Object3D[] = ObjectModificatorService.cloneObjects(objectArray);
    assert.strictEqual(objectArray.length, newArray.length);
  });

  it("should add an object when applyAddModification is called", () => {
    const objectArray: THREE.Object3D[] = [];
    const visitedObjects: THREE.Object3D[] = [];
    const OBJECT_NUMBER: number = 10;
    for (let i: number = 0; i < OBJECT_NUMBER; i++) {
      objectArray.push(new THREE.Object3D());
    }
    objectModificator.applyAddModification(objectArray, visitedObjects);
    assert.isAbove(objectArray.length, OBJECT_NUMBER);
  });

  it("should keep same length when applyColorModification is called", () => {
    const OBJECT_NUMBER: number = 10;
    const objects: THREE.Object3D[] = objectCreator.createObjects(OBJECT_NUMBER);
    const visitedObjects: THREE.Object3D[] = [];
    objectModificator.applyColorModification(objects, visitedObjects);
    assert.strictEqual(objects.length, OBJECT_NUMBER);
  });

  it("should add 2 objects to objectArray", () => {
    const OBJECT_NUMBER: number = 2;
    const originalObjects: THREE.Object3D[] = [];
    const modifiedObjects: THREE.Object3D[] = [];
    const object: THREE.Object3D = new THREE.Object3D();
    object.uuid = "test-uuid";
    object.name = "test-name";
    originalObjects.push(object);
    const secondObject: THREE.Object3D = new THREE.Object3D();
    secondObject.uuid = "test-uuid";
    secondObject.name = "test-name";
    modifiedObjects.push(secondObject);
    const uuids: string[] = objectModificator.isolateDifferences(originalObjects, modifiedObjects);
    assert.strictEqual(uuids.length, OBJECT_NUMBER);
  });

  it("should have same length when makeCloneInfoBackup is called", () => {
    const OBJECT_NUMBER: number = 10;
    const originalObjects: THREE.Object3D[] = objectCreator.createObjects(OBJECT_NUMBER);
    const uuids: string[] = objectModificator.makeCloneInfoBackup(originalObjects);
    assert.strictEqual(uuids.length, OBJECT_NUMBER);
  });

  it("should have return an element of the array", () => {
    const modifications: string[] = ["modi1", "modi2", "modi3"];
    const modification: string = ObjectModificatorService.getRandomModif(modifications);
    assert.isAbove(modifications.indexOf(modification), -1);
  });

});
