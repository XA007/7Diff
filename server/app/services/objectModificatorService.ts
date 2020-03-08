import {inject, injectable} from "inversify";
import * as THREE from "three";
import Types from "../types";
import {ObjectCreatorService} from "./objectCreatorService";

const MODIFICATIONS: number = 7;

@injectable()
export class ObjectModificatorService {

    public storedObjectArray: THREE.Object3D[] = [];
    public constructor(@inject(Types.ObjectCreatorService) public objectCreator: ObjectCreatorService, ) {}

    public static applyRemoveModification(objectArray: THREE.Object3D[], visitedArray: THREE.Object3D[]): void {
        let index: number = (Math.floor(Math.random() * objectArray.length));
        while (visitedArray.indexOf(objectArray[index]) >= 0) { index = (Math.floor(Math.random() * objectArray.length)); }
        objectArray.splice(index, 1);
    }

    public static cloneObjects(objectArray: THREE.Object3D[]): THREE.Object3D[] {
        const newObjectArray: THREE.Object3D[] = [];
        const WINDOW_WIDTH: number = 1680;
        const TWO: number = 2;
        for (const object of objectArray) {
            const obj: THREE.Object3D = object.clone(true);
            obj.position.x = object.position.x + WINDOW_WIDTH / TWO;
            obj.updateMatrixWorld(true);
            newObjectArray.push(obj);
        }

        return newObjectArray;
    }

    public static getRandomModif(modifications: string[]): string {
        const index: number = (Math.floor(Math.random() * modifications.length));

        return modifications[index];
    }

    public applyAddModification(objectArray: THREE.Object3D[], visitedArray: THREE.Object3D[]): void {
        const object: THREE.Object3D[] = this.objectCreator.createObjects(1);
        object[0].name = "add";
        object[0].position.x = this.objectCreator.randomPositionX();
        object[0].position.y = this.objectCreator.randomPositionY();
        object[0].updateMatrixWorld(true);
        objectArray.push(object[0]);
        visitedArray.push(object[0]);
    }

    public applyColorModification(objectArray: THREE.Object3D[], visitedArray: THREE.Object3D[]): void {
        let index: number = (Math.floor(Math.random() * objectArray.length));
        while (visitedArray.indexOf(objectArray[index]) >= 0) { index = (Math.floor(Math.random() * objectArray.length)); }
        let color: number = this.objectCreator.randomColor();
        const material: THREE.MeshLambertMaterial = (objectArray[index] as THREE.Mesh).material as THREE.MeshLambertMaterial;
        const newMaterial: THREE.MeshLambertMaterial = material.clone();
        while (material.color.getHex() === color) {color = this.objectCreator.randomColor(); }
        newMaterial.color.setHex(color);
        (objectArray[index] as THREE.Mesh).material = newMaterial;
        objectArray[index].name = "color";
        visitedArray.push(objectArray[index]);
    }

    public modifyObjectArray(objectArray: THREE.Object3D[], modifications: string[]): THREE.Object3D[] {
        const visitedObjects: THREE.Object3D[] = [];
        for (let i: number = 0; i < MODIFICATIONS; i++) {
            const modif: string = ObjectModificatorService.getRandomModif(modifications);
            switch (modif) {
                case "ADD_OBJECT": {
                    this.applyAddModification(objectArray, visitedObjects);
                    break;
                }
                case "REMOVE_OBJECT": {
                    ObjectModificatorService.applyRemoveModification(objectArray, visitedObjects);
                    break;
                }
                case "MODIFY_OBJECT_COLOR": {
                    this.applyColorModification(objectArray, visitedObjects);
                    break;
                }
                default: {
                    break;
                }
            }
        }

        return objectArray;
    }

    public makeCloneInfoBackup(objectArray: THREE.Object3D[]): string[] {
        const uuids: string[] = [];
        objectArray.forEach((object: THREE.Object3D) => uuids.push(object.uuid));

        return uuids;
    }

    public identifyObjects(cloneUuids: string[], objectArray: THREE.Object3D[], newObjectArray: THREE.Object3D[]): void {
        const newCloneUuids: string[] = this.makeCloneInfoBackup(newObjectArray);
        const missing: string[] = cloneUuids.filter((item: string) => {
            return (newCloneUuids.indexOf(item) < 0);
        });
        missing.forEach((uuid: string) => {
            const WINDOW_WIDTH: number = 1680;
            const TWO: number = 2;
            const object: THREE.Object3D = objectArray[cloneUuids.indexOf(uuid)];
            object.name = "remove";
            const objectClone: THREE.Object3D = object.clone(true);
            objectClone.position.x = object.position.x + WINDOW_WIDTH / TWO;
            objectClone.name = "remove-hidden";
            objectClone.layers.mask = 0;
            objectClone.updateMatrixWorld(true);
            newObjectArray.push(objectClone);
        });
        newObjectArray.forEach((item: THREE.Object3D) => {
            if (item.name === "color") {
                objectArray[cloneUuids.indexOf(item.uuid)].name = "color";
            }
        });
    }

    public isolateDifferences(originalObjectArray: THREE.Object3D[], modifiedObjectArray: THREE.Object3D[]): string[] {
        const objectArray: string[] = [];
        originalObjectArray.forEach((object: THREE.Object3D) => {
            if (object.name !== "") {
                objectArray.push(object.uuid);
            }
        });
        modifiedObjectArray.forEach((object: THREE.Object3D) => {
            if (object.name !== "") {
                objectArray.push(object.uuid);
            }
        });

        return objectArray;
    }
}
