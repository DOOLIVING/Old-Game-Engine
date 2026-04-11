import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { Camera } from './Camera.js';
import { MenuScene, GameLevel } from './script.js';

const width = 1200;
const height = 650;
let scene, renderer, sceneCamera, currentScene;
const keys = {};

function setup() {
    scene = new THREE.Scene();
    sceneCamera = new Camera(width, height);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    const startLevel = () => {
        currentScene.destroy();
        currentScene = new GameLevel(scene, width, height, sceneCamera, keys, startMenu);
    };

    const startMenu = () => {
        if(currentScene) currentScene.destroy();
        currentScene = new MenuScene(scene, width, height, startLevel);
    };

    currentScene = new MenuScene(scene, width, height, startLevel);
    
    window.onkeydown = (e) => keys[e.key.toLowerCase()] = true;
    window.onkeyup = (e) => keys[e.key.toLowerCase()] = false;
    
    function draw() {
        requestAnimationFrame(draw);
        if (currentScene) {
            currentScene.update();
            currentScene.display();
        }
        renderer.render(scene, sceneCamera.threeCamera);
    }
    draw();
}

setup();