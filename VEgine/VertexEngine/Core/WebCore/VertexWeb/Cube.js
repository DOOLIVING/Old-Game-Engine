import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { PhysicsBody, floorY } from './Physics.js';

export class Cube {
    constructor(scene, x, y, z, size, r, g, b, physics = false, texPath = null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
        this.physics = physics;
        this.pb = new PhysicsBody();

        let material;
        if (texPath) {
            const texture = new THREE.TextureLoader().load(texPath);
            material = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            material = new THREE.MeshStandardMaterial({ color: new THREE.Color(r/255, g/255, b/255) });
        }
        
        const geom = new THREE.BoxGeometry(size, size, size);
        this.mesh = new THREE.Mesh(geom, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);
    }

    updatePhysics() {
        if (this.physics) {
            this.pb.applyGravity();
            this.pb.applyFriction();
            this.x += this.pb.velocity.x;
            this.y += this.pb.velocity.y;
            this.z += this.pb.velocity.z;
            
            if (this.y - this.size / 2 <= floorY) {
                this.y = floorY + this.size / 2;
                this.pb.velocity.y *= -this.pb.bounciness;
                if (Math.abs(this.pb.velocity.y) < 0.2) this.pb.velocity.y = 0;
                this.pb.onGround = true;
            } else {
                this.pb.onGround = false;
            }
        }
    }

    display() {
        this.mesh.position.set(this.x, this.y, this.z);
    }
}