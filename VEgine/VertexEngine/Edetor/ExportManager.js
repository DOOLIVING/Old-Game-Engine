export class ExportManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }
    
    exportToGameEngine() {
        const camera = this.sceneManager.getCamera();
        const objects = this.sceneManager.getObjects();
        
        let gameCode = `import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { SceneBase } from './Scene.js';
import { Cube } from './Cube.js';
import { Sphere } from './Sphere.js';
import { Light } from './Light.js';
import { Model } from './Model.js';
import { Button, Texts } from './UI.js';

export class MenuScene extends SceneBase {
    constructor(threeScene, width, height, onStart) {
        super(threeScene);
        this.worldTexts.push(new Texts(width/2 - 250, 150, 255, 255, 255, "OG ENGINE GAME", 64));
        this.worldButton.push(new Button(width/2 - 100, height/2, 200, 60, 0, 150, 0, "ИГРАТЬ", onStart));
    }
}

export class GameLevel extends SceneBase {
    constructor(threeScene, width, height, sceneCamera, keys, onMenu) {
        super(threeScene);
        this.sceneCamera = sceneCamera;
        this.keys = keys;
        
        // Установка позиции камеры из редактора
        this.sceneCamera.x = ${camera.position.x};
        this.sceneCamera.y = ${camera.position.y};
        this.sceneCamera.z = ${camera.position.z};

`;
        
        objects.forEach(obj => {
            const p = obj.mesh.position;
            const s = obj.mesh.scale;
            
            if (obj.type === 'cube') {
                gameCode += `        this.worldCubes.push(new Cube(threeScene, ${p.x}, ${p.y}, ${p.z}, ${10 * s.x}, 68, 170, 68, ${obj.physics}));\n`;
            } else if (obj.type === 'sphere') {
                gameCode += `        this.worldSphere.push(new Sphere(threeScene, ${p.x}, ${p.y}, ${p.z}, ${5 * s.x}, 170, 68, 68, ${obj.physics}));\n`;
            } else if (obj.type === 'light') {
                gameCode += `        this.worldLight.push(new Light(threeScene, 255, 170, 0, ${p.x}, ${p.y}, ${p.z}));\n`;
            } else if (obj.type === 'model') {
                gameCode += `        this.worldModels.push(new Model(threeScene, "${obj.path}", ${p.x}, ${p.y}, ${p.z}, ${s.x}, ${s.y}, ${s.z}));\n`;
            }
        });
        
        gameCode += `
        this.worldButton.push(new Button(20, height - 60, 100, 40, 150, 0, 0, "МЕНЮ", onMenu));
    }

    update() {
        super.update();
        const speed = 1.5;
        const rotSpeed = 0.04;

        // Вперед-назад (W/S)
        if (this.keys['w']) {
            this.sceneCamera.x += Math.cos(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z += Math.sin(this.sceneCamera.yaw) * speed;
        }
        if (this.keys['s']) {
            this.sceneCamera.x -= Math.cos(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z -= Math.sin(this.sceneCamera.yaw) * speed;
        }

        // Влево-вправо (A/D) - стрейф
        if (this.keys['a']) {
            this.sceneCamera.x += Math.sin(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z -= Math.cos(this.sceneCamera.yaw) * speed;
        }
        if (this.keys['d']) {
            this.sceneCamera.x -= Math.sin(this.sceneCamera.yaw) * speed;
            this.sceneCamera.z += Math.cos(this.sceneCamera.yaw) * speed;
        }

        // Вверх-вниз (Q/E)
        if (this.keys['q']) this.sceneCamera.y -= speed;
        if (this.keys['e']) this.sceneCamera.y += speed;

        // Повороты (Стрелочки)
        if (this.keys['arrowleft']) this.sceneCamera.yaw -= rotSpeed;
        if (this.keys['arrowright']) this.sceneCamera.yaw += rotSpeed;
        if (this.keys['arrowup']) this.sceneCamera.pitch -= rotSpeed;
        if (this.keys['arrowdown']) this.sceneCamera.pitch += rotSpeed;

        this.sceneCamera.apply();
    }
}`;
        
        const exportCodeElement = document.getElementById('export-code');
        const exportPreviewElement = document.getElementById('export-preview');
        
        if (exportCodeElement) exportCodeElement.textContent = gameCode;
        if (exportPreviewElement) exportPreviewElement.style.display = 'block';
    }
}