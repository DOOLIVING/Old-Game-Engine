import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { SceneBase } from './Scene.js';
import { Cube } from './Cube.js';
import { Sphere } from './Sphere.js';
import { Light } from './Light.js';
import { Model } from './Model.js';
import { ParticleSystem } from './ParticleSystem.js';
import { Button, Texts } from './UI.js';

let Xcar = 0;

export class MenuScene extends SceneBase {
    constructor(threeScene, width, height, onStart) {
        super(threeScene);
        this.bgColor = 180;
        this.worldTexts.push(new Texts(width/2 - 250, 150, 255, 255, 255, "OLD GAME ENGINE", 64));
        this.worldButton.push(new Button(width/2 - 100, height/2, 200, 60, 0, 150, 0, "СТАРТ", onStart));
    }
}

export class GameLevel extends SceneBase {
    constructor(threeScene, width, height, sceneCamera, keys, onMenu) {
        super(threeScene);
        this.width = width; this.height = height;
        this.sceneCamera = sceneCamera;
        this.keys = keys;
        this.bgColor = 30;

        const texturePath = "data_web/images.jpeg";

        this.worldCubes.push(new Cube(threeScene, 0, -25, 0, 200, 100, 100, 100, false));
        this.worldCubes.push(new Cube(threeScene, 0, 120, 0, 80, 100, 100, 150, false));

        this.worldCubes.push(new Cube(threeScene, 60, 130, 60, 30, 255, 255, 255, true, texturePath));
        this.worldCubes.push(new Cube(threeScene, 0, 300, 0, 40, 255, 100, 100, true));
        this.worldSphere.push(new Sphere(threeScene, -60, 250, 80, 20, 255, 200, 0, true));

        this.worldParticles.push(new ParticleSystem(threeScene, new THREE.Vector3(0, 130, 0)));
        this.worldLight.push(new Light(threeScene, 255, 200, 150, 100, 200, 100));
        
        threeScene.add(new THREE.AmbientLight(0x404040, 0.5));

        this.mainCar = new Model(threeScene, "data_web/car.obj", 204, 30, 0, 40, 40, 40);
        this.worldModels.push(this.mainCar);

        this.worldButton.push(new Button(20, height - 70, 100, 40, 150, 50, 50, "МЕНЮ", onMenu));
    }
    
    update() {
        super.update();
        const speed = 3.0;
        const rotateSpeed = 0.05;

        if (this.keys['w']) { 
            this.sceneCamera.x += Math.cos(this.sceneCamera.yaw) * speed; 
            this.sceneCamera.z += Math.sin(this.sceneCamera.yaw) * speed; 
        }
        if (this.keys['s']) { 
            this.sceneCamera.x -= Math.cos(this.sceneCamera.yaw) * speed; 
            this.sceneCamera.z -= Math.sin(this.sceneCamera.yaw) * speed; 
        }
        if (this.keys['a']) {
            this.sceneCamera.x += Math.sin(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z -= Math.cos(this.sceneCamera.yaw) * speed;
        }
        if (this.keys['d']) {
            this.sceneCamera.x -= Math.sin(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z += Math.cos(this.sceneCamera.yaw) * speed;
        }

        if (this.keys['e']) { this.sceneCamera.y += speed; }
        if (this.keys['q']) { this.sceneCamera.y -= speed; }

        if (this.keys['arrowleft']) this.sceneCamera.yaw -= rotateSpeed;
        if (this.keys['arrowright']) this.sceneCamera.yaw += rotateSpeed;
        if (this.keys['arrowup']) this.sceneCamera.pitch -= rotateSpeed;
        if (this.keys['arrowdown']) this.sceneCamera.pitch += rotateSpeed;

        this.sceneCamera.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.sceneCamera.pitch));

        if (this.keys['r']) { 
            Xcar += 2; 
            if (this.mainCar) this.mainCar.x = Xcar; 
        }
        
        this.sceneCamera.apply();
    }
}