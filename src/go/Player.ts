import App from "App";
import {
    Vector3, Mesh,
} from 'babylonjs';
import AbstractGameObject from "go/GameObject";
import Turret from "go/Turret";

const PLAYER_HEIGHT = 2;

export default class Player extends AbstractGameObject {

    mesh: Mesh;

    rotX: number = 0;
    rotY: number = 0;
    isPointerLocked: boolean = false;

    constructor(
        public app: App
    ) {
        super(app);
        this.app.canvas.addEventListener('click', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    setupMesh() {
        return new Mesh('player', this.app.scene);
    }

    onMouseDown = (e: MouseEvent) => {
        // @ts-ignore
        if (!document.pointerLockElement) {
            this.app.canvas.requestPointerLock();
            return;
        }
        const {hit, pickedPoint} = this.app.scene.pick(
            window.innerWidth / 2,
            window.innerHeight / 2,
            m => m === this.app.netfield.mesh
        );
        if (!hit) {
            return;
        }
        console.log(pickedPoint.x, pickedPoint.z);
        const t = new Turret(this.app, pickedPoint.x, pickedPoint.z);
        console.log(t);
    }

    onMouseMove = (e: MouseEvent) => {
        if (!document.pointerLockElement) {
            return;
        }
        this.rotY += e.movementX / 200;
        this.rotX += e.movementY / 200;
        if (this.rotX > Math.PI / 2.3) {
            this.rotX = Math.PI / 2.3;
        }
        if (this.rotX < 0) {
            this.rotX = 0;
        }
        this.app.camera.rotation.x = this.rotX;
        this.app.camera.rotation.y = this.rotY;
    }

    placeTurret() {

    }

    update() {
        const {house, camera} = this.app;
        const {boundingBox: bbox} = house.mesh.getBoundingInfo();
        if (!a) {
            a = true;
            console.log(bbox);
        }
        camera.position.y = (bbox.maximumWorld.y + PLAYER_HEIGHT);
    }
}

let a = false;
