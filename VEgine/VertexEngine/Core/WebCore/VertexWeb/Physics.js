import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

export const gravityForce = 0.5;
export const friction = 0.95;
export const airResistance = 0.98;
export const floorY = 0;

export class PhysicsBody {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.onGround = false;
        this.bounciness = 0.3;
    }

    applyGravity() {
        if (!this.onGround) this.velocity.y -= gravityForce;
    }

    applyFriction() {
        this.velocity.x *= friction;
        this.velocity.z *= friction;
        this.velocity.x *= airResistance;
        this.velocity.y *= airResistance;
        this.velocity.z *= airResistance;
        if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
        if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
        if (Math.abs(this.velocity.y) < 0.01) this.velocity.y = 0;
    }
}

export function resolveCollision(dynamic, staticObj) {
    let r1 = dynamic.size / 2.0;
    let r2 = staticObj.size / 2.0;

    let dx = dynamic.x - staticObj.x;
    let dy = dynamic.y - staticObj.y;
    let dz = dynamic.z - staticObj.z;

    let overlapX = (r1 + r2) - Math.abs(dx);
    let overlapY = (r1 + r2) - Math.abs(dy);
    let overlapZ = (r1 + r2) - Math.abs(dz);

    if (overlapX > 0 && overlapY > 0 && overlapZ > 0) {
        if (overlapY < overlapX && overlapY < overlapZ) {
            if (dy > 0) {
                dynamic.y += overlapY;
                dynamic.pb.velocity.y = Math.max(0, dynamic.pb.velocity.y);
                dynamic.pb.onGround = true;
            } else {
                dynamic.y -= overlapY;
                dynamic.pb.velocity.y = Math.min(0, dynamic.pb.velocity.y);
            }
        } else if (overlapX < overlapZ) {
            if (dx > 0) dynamic.x += overlapX;
            else dynamic.x -= overlapX;
            dynamic.pb.velocity.x = 0;
        } else {
            if (dz > 0) dynamic.z += overlapZ;
            else dynamic.z -= overlapZ;
            dynamic.pb.velocity.z = 0;
        }
        return true;
    }
    return false; 
}