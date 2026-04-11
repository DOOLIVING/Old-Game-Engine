import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { resolveCollision } from './Physics.js';

export class SceneBase {
    constructor(threeScene) {
        this.threeScene = threeScene;
        this.worldButton = [];
        this.worldCubes = [];
        this.worldSphere = [];
        this.worldLight = [];
        this.worldTexts = [];
        this.worldModels = [];
        this.worldParticles = [];
        this.bgColor = 255;
    }
    
    update() {
        for (let ps of this.worldParticles) ps.display();
        
        // Physics update
        for (let c of this.worldCubes) if (c.physics) c.updatePhysics();
        for (let s of this.worldSphere) if (s.physics) s.updatePhysics();

        // Collision resolve
        let dynamicObjects = [...this.worldCubes.filter(c => c.physics), ...this.worldSphere.filter(s => s.physics)];
        for (let obj of dynamicObjects) {
            for (let staticCube of this.worldCubes) {
                if (obj === staticCube) continue;
                resolveCollision(obj, staticCube);
            }
        }
        
        for (let m of this.worldModels) m.display();
    }
    
    display() {
        this.threeScene.background = new THREE.Color(this.bgColor / 255, this.bgColor / 255, this.bgColor / 255);
        for (let lg of this.worldLight) lg.display();
        for (let c of this.worldCubes) c.display();
        for (let s of this.worldSphere) s.display();
    }
    
    destroy() {
        for (let btn of this.worldButton) btn.hide();
        for (let text of this.worldTexts) text.hide();
        for (let c of this.worldCubes) this.threeScene.remove(c.mesh);
        for (let s of this.worldSphere) this.threeScene.remove(s.mesh);
        for (let m of this.worldModels) if (m.mesh) this.threeScene.remove(m.mesh);
        for (let lg of this.worldLight) { this.threeScene.remove(lg.light); this.threeScene.remove(lg.mesh); }
    }
}