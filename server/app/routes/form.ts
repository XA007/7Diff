import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import {inject, injectable, } from "inversify";
import "reflect-metadata";
import * as THREE from "three";
import {ImageDifferencesGenerator as DifferenceGenerator} from "../services/DifferencesGenerator/ImageDifferencesGenerator";
import {PixelsLabelingService as PixelLabeling} from "../services/DifferencesGenerator/PixelsLabelingService";
import {BufferToArrayBufferService} from "../services/bufferToArrayBufferService";
import {FormVerificationService} from "../services/formVerificationService";
import {GameService} from "../services/gameService";
import {ObjectCreatorService} from "../services/objectCreatorService";
import {ObjectModificatorService} from "../services/objectModificatorService";
import {SimpleViewDifference} from "../services/simpleViewDifferenceService";
import Types from "../types";

export module FormRoutes {

    @injectable()
    export class Form {

        public constructor(@inject(Types.GameService) public game: GameService,
                           @inject(Types.ObjectCreatorService) public objectCreator: ObjectCreatorService,
                           @inject(Types.ObjectModificationService) public objectModification: ObjectModificatorService,
                           @inject(Types.SimpleViewDifferenceService) public simpleViewDiffService:
                               SimpleViewDifference.SimpleViewDifferenceService) {}

        public static extractFreeGameModifications(req: Request): string[] {
            const modifications: string[] = [];
            if (JSON.parse(req.body.body).isAddition) {modifications.push("ADD_OBJECT"); }
            if (JSON.parse(req.body.body).isDeletion) {modifications.push("REMOVE_OBJECT"); }
            if (JSON.parse(req.body.body).isColorChanging) {modifications.push("MODIFY_OBJECT_COLOR"); }

            return modifications;
        }

        public async verifyForm(req: Request, res: Response, next: NextFunction): Promise<void> {

            const gameName: string = req.body.gameName;
            const originalImageBuffer: Buffer = req.files[0].buffer;
            const modifiedImageBuffer: Buffer = req.files[1].buffer;

            const bufferToArrayBuffer: BufferToArrayBufferService = new BufferToArrayBufferService();
            const formVerification: FormVerificationService = new FormVerificationService(bufferToArrayBuffer);
            let errorCode: string = formVerification.verifyImageInfos(originalImageBuffer, modifiedImageBuffer);
            await this.game.verifyGameExists(gameName).then((result: boolean) => {
                if (!result) {
                    errorCode += "Game name is already used /";
                }
            });

            return new Promise((resolve: Function) => {
                resolve(errorCode);
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async generateDifferencesImage(req: Request, res: Response, next: NextFunction): Promise<void> {

            const originalImageNewPath: string = "uploads/" + req.body.gameName + "-" + req.files[0].fieldname + ".bmp";
            fs.renameSync(req.files[0].path, originalImageNewPath);

            const modifiedImageNewPath: string = "uploads/" + req.body.gameName + "-" + req.files[1].fieldname + ".bmp";
            fs.renameSync(req.files[1].path, modifiedImageNewPath);

            const diffGenerator: DifferenceGenerator = new DifferenceGenerator(originalImageNewPath, modifiedImageNewPath);
            const labeledPixels: PixelLabeling = new PixelLabeling(diffGenerator.differencesBuffer, diffGenerator.originalImgBuffer);
            let message: string = "Le jeu ne contient pas 7 differences";

            if ( labeledPixels.contains7Differences()) {
                this.simpleViewDiffService.generatePixelsDiffAssets(labeledPixels, req.body.gameName);
                diffGenerator.createBmpImage(req.body.gameName);
                message = "Success";
                await this.addSimpleGameToDB(req);
            } else {
                fs.unlinkSync(originalImageNewPath);
                fs.unlinkSync(modifiedImageNewPath);
            }

            return new Promise((resolve: Function) => {
                resolve(message);
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async receiveFreeGameInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
            const gameName: string = JSON.parse(req.body.body).gameName;
            const originalObjectsPath: string = "objects/" + gameName + "-" + "originalObjects.json";
            const modifiedObjectsPath: string = "objects/" + gameName + "-" + "modifiedObjects.json";
            const differentObjectsPath: string = "objects/" + gameName + "-" + "differentObjects.json";
            const modifications: string[] = FormRoutes.Form.extractFreeGameModifications(req);
            const objectArray: THREE.Object3D[] = this.objectCreator.createObjects(JSON.parse(req.body.body).objectQuantity);
            const newObjectArray: THREE.Object3D[] = ObjectModificatorService.cloneObjects(objectArray);
            const cloneUuids: string[] = this.objectModification.makeCloneInfoBackup(newObjectArray);
            this.objectModification.modifyObjectArray(newObjectArray, modifications);
            this.objectModification.identifyObjects(cloneUuids, objectArray, newObjectArray);
            const differentObjects: string[] = this.objectModification.isolateDifferences(objectArray, newObjectArray);
            objectArray.push(this.objectCreator.createCenterBar());
            fs.writeFileSync(originalObjectsPath, JSON.stringify(objectArray), "utf-8");
            fs.writeFileSync(modifiedObjectsPath, JSON.stringify(newObjectArray), "utf-8");
            fs.writeFileSync(differentObjectsPath, JSON.stringify(differentObjects), "utf-8");

            return new Promise((resolve: Function) => {
                resolve("Success");
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async addFreeGameToDB(req: Request, res: Response, next: NextFunction): Promise<void> {
            const gameName: string = JSON.parse(req.body.body).gameName;
            const originalObjectsPath: string = "objects/" + gameName + "-" + "originalObjects.json";
            const modifiedObjectsPath: string = "objects/" + gameName + "-" + "modifiedObjects.json";
            const modifications: string[] = FormRoutes.Form.extractFreeGameModifications(req);
            await this.game.addFreeGameToDB(gameName, JSON.parse(req.body.body).dataURL,
                                            originalObjectsPath, modifiedObjectsPath, modifications);

            return new Promise((resolve: Function) => {
                resolve("Success");
            }).then((value: string) => {
                res.send(value);
            });
        }

        public async addSimpleGameToDB(req: Request): Promise<void> {
            const originalImageName: string = req.body.gameName + "-" + req.files[0].fieldname;
            const originalURL: string = "http://localhost:3000/" + originalImageName + ".bmp";
            const modifiedImageName: string = req.body.gameName + "-" + req.files[1].fieldname;
            const modifiedURL: string = "http://localhost:3000/" + modifiedImageName + ".bmp";
            await this.game.addSimpleGameToDB(req.body.gameName, originalURL, modifiedURL, originalImageName, modifiedImageName);
        }
    }
}
