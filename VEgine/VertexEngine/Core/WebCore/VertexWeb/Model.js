import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/OBJLoader.js';

export class Model {
    constructor(scene, path, x, y, z, scaleX, scaleY, scaleZ) {
        this.x = x; this.y = y; this.z = z;
        this.rotY = 0;
        this.mesh = null;
        this.loaded = false;

        const loader = new OBJLoader();
        loader.load(path, (obj) => {
            this.mesh = obj;
            this.mesh.scale.set(scaleX, scaleY, scaleZ);
            this.mesh.traverse(child => {
                if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
            });
            scene.add(this.mesh);
            this.loaded = true;
        });
    }

    display() {
        if (this.mesh && this.loaded) {
            this.mesh.position.set(this.x, this.y, this.z);
            this.mesh.rotation.y = this.rotY;
        }
    }
}