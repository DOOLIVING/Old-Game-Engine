import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

export class Light {
    constructor(scene, r, g, b, x, y, z) {
        this.x = x; this.y = y; this.z = z;
        this.light = new THREE.PointLight(new THREE.Color(r/255, g/255, b/255), 1, 300);
        this.light.position.set(x, y, z);
        scene.add(this.light);
        
        const geometry = new THREE.SphereGeometry(2, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(r/255, g/255, b/255), 
            emissive: new THREE.Color(r/255, g/255, b/255), 
            emissiveIntensity: 1 
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, y, z);
        scene.add(this.mesh);
    }
    
    display() {
        this.light.position.set(this.x, this.y, this.z);
        this.mesh.position.set(this.x, this.y, this.z);
    }
}