import App from "App";
import {
    Vector3, Mesh,
} from 'babylonjs';
import GameObject from "go/GameObject";
import Turret from "go/Turret";

const PLAYER_HEIGHT = 2;

export default class Player extends GameObject {
    rotX: number = 0;
    rotY: number = 0;

    constructor(
        public app: App,
        position?: Vector3
    ) {
        super('Player', app, position);
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
        this.placeTurret();
    }

    placeTurret() {
        const { hit, pickedPoint } = this.app.scene.pick(
            window.innerWidth / 2,
            window.innerHeight / 2,
            m => m === this.app.gameObjectsByType.NetField[0].mesh
        );
        if (!hit) {
            return;
        }
        new Turret(this.app, pickedPoint.x, pickedPoint.z);
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
        if (this.rotX < - Math.PI / 2.1) {
            this.rotX = -Math.PI / 2.1;
        }
        this.app.camera.rotation.x = this.rotX;
        this.app.camera.rotation.y = this.rotY;
    }

    update() {
        const {gameObjectsByType: {House: [house]}, camera} = this.app;
        const {boundingBox: bbox} = house.mesh.getBoundingInfo();
        camera.position.y = (bbox.maximumWorld.y + PLAYER_HEIGHT);
    }
}
