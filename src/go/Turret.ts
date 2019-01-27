import AbstractGameObject from 'go/GameObject';
import { Mesh, MeshBuilder, PhysicsImpostor, Vector3 } from 'babylonjs';
import App from 'App';
import * as C from 'C';
import TurretBullet from './TurretBullet';
import Trojan from './Trojan';

let count = 0;

export default class Turret extends AbstractGameObject {
    typeName: 'Turret';

    constructor(app: App, x: number, z: number){
        super(app, new Vector3(x, 0, z));
        this.app.turrets.push(this);
        this.setInterval(this.fireAtNearestEnemy, C.TURRET_INITIAL_FIRE_TIME);
    }

    setupMesh() {
        const mesh = MeshBuilder.CreateCylinder(
            this.meshName,
            {
                diameterBottom: C.TURRET_DIAMETER_BOTTOM,
                diameterTop: C.TURRET_DIAMETER_TOP,
                subdivisions: C.TURRET_SUBDIVISIONS,
                tessellation: C.TURRET_TESSELATION
            },
            this.app.scene
        );
        mesh.position.y = C.TURRET_H / 2;
        mesh.material = this.app.scene.materials[2];
        return mesh;
    }

    setupImpostor() {
        return new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.CylinderImpostor,
            {
                mass: 0.1
            },
            this.app.scene
        );
    }

    destroy() {
        this.app.turrets = this.app.turrets.filter(t => t !== this);
    }

    fireAtNearestEnemy = () => {
        const enemy = this.findNearestEnemy();
        if (!enemy) {
            return;
        }
        const vdiff = Vector3.Normalize(new Vector3(
            enemy.mesh.position.x - this.mesh.position.x,
            0,
            enemy.mesh.position.z - this.mesh.position.z,
        ));
        const p = new Vector3(
            this.mesh.position.x + (vdiff.x * C.TURRET_BULLET_SPAWN_DIST),
            C.TURRET_H / 2,
            this.mesh.position.z + (vdiff.z * C.TURRET_BULLET_SPAWN_DIST),
        );
        const v = new Vector3(
            vdiff.x * C.TURRET_BULLET_MAX_SPEED,
            0,
            vdiff.z * C.TURRET_BULLET_MAX_SPEED
        );
        new TurretBullet(this.app, this, p, v);
    }

    findNearestEnemy() {
        let shortestDist = 10000000000;
        let enemy: Trojan = null;
        for (let en of this.app.trojans) {
            const dist = Vector3.Distance(
                this.mesh.position,
                en.mesh.position
            );
            if (dist < shortestDist) {
                shortestDist = dist;
                enemy = en;
            }
        }
        return enemy;
    }
}
