import {injectable} from "inversify";
import * as THREE from "three";

const Z_COORDINATES: number = -200;
const Y_COORDINATES_MAX: number = 800;
const Y_COORDINATES_MIN: number = 400;

@injectable()
export class ObjectCreatorService {

    public randomSizeGeometryObject(): THREE.Geometry {
        const CUBE: number = 0;
        const CYLINDER: number = 1;
        const SPHERE: number = 2;
        const CONE: number = 3;
        const PYRAMID: number = 4;

        switch (this.randomObjectType()) {
            case CUBE: return this.randomSizeCube();
            case CYLINDER: return this.randomSizeCylinder();
            case SPHERE: return this.randomSizeSphere();
            case CONE: return this.randomSizeCone();
            case PYRAMID: return this.randomSizePyramid();
            default: return this.randomSizeCube();
        }
    }

    public randomSizeCube(): THREE.BoxGeometry {
        const CUBE_DIMENSIONS: number = 20;
        const randomSize: number = this.randomSize();

        return new THREE.BoxGeometry( CUBE_DIMENSIONS * randomSize, CUBE_DIMENSIONS * randomSize, CUBE_DIMENSIONS * randomSize);
    }

    public randomSizeCylinder(): THREE.CylinderGeometry {
        const CYLINDER_RADIUS: number = 10;
        const CYLINDER_HEIGHT: number = 40;
        const CYLINDER_SEGMENT: number = 64;
        const randomSize: number = this.randomSize();

        return new THREE.CylinderGeometry(CYLINDER_RADIUS * randomSize, CYLINDER_RADIUS * randomSize,
                                          CYLINDER_HEIGHT * randomSize, CYLINDER_SEGMENT * randomSize);
    }

    public randomSizeSphere(): THREE.SphereGeometry {
        const SPHERE_RADIUS: number = 10;
        const SPHERE_SEGMENT: number = 64;
        const randomSize: number = this.randomSize();

        return new THREE.SphereGeometry(SPHERE_RADIUS * randomSize, SPHERE_SEGMENT * randomSize, SPHERE_SEGMENT * randomSize);
    }

    public randomSizeCone(): THREE.ConeGeometry {
        const CONE_RADIUS: number = 10;
        const CONE_HEIGHT: number = 40;
        const CONE_SEGMENT: number = 64;
        const randomSize: number = this.randomSize();

        return new THREE.ConeGeometry(CONE_RADIUS * randomSize, CONE_HEIGHT * randomSize, CONE_SEGMENT * randomSize);
    }

    public randomSizePyramid(): THREE.TetrahedronGeometry {
        const PYRAMID_RADIUS: number = 20;
        const PYRAMID_DETAIL: number = 0;
        const randomSize: number = this.randomSize();

        return new THREE.TetrahedronGeometry(PYRAMID_RADIUS * randomSize, PYRAMID_DETAIL);
    }

    public createObjects(objectNumber: number): THREE.Object3D[] {
        const objectArray: THREE.Object3D[] = [];

        for (let i: number = 0; i < objectNumber; i++) {
            const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color: this.randomColor()});
            const object: THREE.Object3D = new THREE.Mesh(this.randomSizeGeometryObject(), material);

            object.position.x = this.randomPositionX();
            object.position.y = this.randomPositionY();
            object.position.z = Z_COORDINATES;
            object.rotation.x = this.randomObjectRotation();
            object.rotation.y = this.randomObjectRotation();
            object.rotation.z = this.randomObjectRotation();
            object.updateMatrixWorld(true);
            objectArray[i] = object;
        }

        return objectArray;
    }

    public randomPositionX(): number {
        const WINDOW_WIDTH: number = 1680;
        const TWO: number = 2;
        const FOUR: number = 4;
        const EIGHT: number = 8;

        return (- Math.random() * (WINDOW_WIDTH / TWO - WINDOW_WIDTH / FOUR) - WINDOW_WIDTH / EIGHT);
    }

    public randomPositionY(): number {
        return Math.random() * Y_COORDINATES_MAX - Y_COORDINATES_MIN;
    }

    public randomObjectRotation(): number {
        const TWO: number = 2;
        const MAX_VALUE: number = Math.PI * TWO;

        return (Math.random() * MAX_VALUE);
    }

    public randomColor(): number {
        const WHITE: number = 0xFFFFFF;

        return (Math.random() * WHITE);
    }

    public randomSize(): number {
        const MAX_SIZE: number = 1.5;
        const MIN_SIZE: number = 0.5;

        return ((Math.random() * MAX_SIZE) + MIN_SIZE);
    }

    public randomObjectType(): number {
        const NUMBER_OF_OPTIONS: number = 6;

        return Math.floor(Math.random() * NUMBER_OF_OPTIONS);
    }

    public createCenterBar(): THREE.Object3D {
        const WHITE: number = 0xFFFFFF;
        const WIDTH: number = 10;
        const HEIGHT: number = 1000;
        const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color: WHITE});
        const object: THREE.Object3D = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT), material);
        object.position.z = Z_COORDINATES;
        object.updateMatrixWorld(true);

        return object;
    }

}
