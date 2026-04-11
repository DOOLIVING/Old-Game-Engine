import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

class Particle {
    constructor(scene, origin, sc, ec, ss, es) {
        this.scene = scene;
        this.position = origin.clone();
        this.velocity = new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 2, (Math.random() - 0.5) * 1.5);
        this.lifespan = 100;
        this.maxLifespan = 100;
        this.sCol = sc; this.eCol = ec;
        this.sSize = ss; this.eSize = es;
        
        const geometry = new THREE.SphereGeometry(ss/2, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: sc, transparent: true, opacity: 0.8 });
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
    }
    
    update() {
        this.velocity.y -= 0.02; // Gravity
        this.position.add(this.velocity);
        this.lifespan -= 2;
        this.mesh.position.copy(this.position);
        let pct = 1 - (this.lifespan / this.maxLifespan);
        this.mesh.material.color.copy(this.sCol).lerp(this.eCol, pct);
        this.mesh.scale.setScalar(1 - pct);
    }
    
    isDead() { return this.lifespan <= 0; }
    dispose() { this.scene.remove(this.mesh); }
}

export class ParticleSystem {
    constructor(scene, position) {
        this.scene = scene;
        this.particles = [];
        this.origin = position.clone();
    }
    
    display() {
        if (this.particles.length < 50) {
            this.particles.push(new Particle(this.scene, this.origin, new THREE.Color(1, 0.5, 0), new THREE.Color(0.2, 0.2, 0.2), 2, 0.1));
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles[i].dispose();
                this.particles.splice(i, 1);
            }
        }
    }
}