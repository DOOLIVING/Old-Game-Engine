import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/TransformControls.js';
import { SceneManager } from './SceneManager.js';
import { UIManager } from './UIManager.js';
import { ExportManager } from './ExportManager.js';
import { ObjectFactory } from './ObjectFactory.js';

let sceneManager, uiManager, exportManager, objectFactory;

function init() {
    sceneManager = new SceneManager();
    objectFactory = new ObjectFactory(sceneManager);
    exportManager = new ExportManager(sceneManager);
    uiManager = new UIManager(sceneManager, objectFactory, exportManager);
    
    uiManager.setupEventHandlers();
    sceneManager.animate();
}

init();