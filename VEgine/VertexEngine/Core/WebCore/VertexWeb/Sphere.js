import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { PhysicsBody, floorY } from './Physics.js';

export class Sphere {
    constructor(scene, x, y, z, radius, r, g, b, physics = false) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.size = radius * 2;
        this.physics = physics;
        this.pb = new PhysicsBody();

        const geom = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(r/255, g/255, b/255) });
        this.mesh = new THREE.Mesh(geom, material);
        this.mesh.castShadow = true;
        scene.add(this.mesh);
    }

    updatePhysics() {
        if (this.physics) {
            this.pb.applyGravity();
            this.y += this.pb.velocity.y;
            if (this.y - this.radius <= floorY) {
                this.y = floorY + this.radius;
                this.pb.velocity.y = 0;
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