import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

export class Camera {
    constructor(width, height) {
        this.x = 70.0;
        this.y = 35.0;
        this.z = 120.0;
        this.yaw = -Math.PI / 2;
        this.pitch = 0;
        this.threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    }

    apply() {
        let lookX = this.x + Math.cos(this.yaw) * Math.cos(this.pitch);
        let lookY = this.y + Math.sin(this.pitch);
        let lookZ = this.z + Math.sin(this.yaw) * Math.cos(this.pitch);
        
        this.threeCamera.position.set(this.x, this.y, this.z);
        this.threeCamera.lookAt(lookX, lookY, lookZ);
    }
}