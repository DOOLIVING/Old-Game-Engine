import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/TransformControls.js';
import { SceneManager } from './SceneManager.js';
import { UIManager } from './UIManager.js';
import { ExportManager } from './ExportManager.js';
import { ObjectFactory } from './ObjectFactory.js';
import { BlueprintEditor } from './BlueprintEditor.js';

let sceneManager, uiManager, exportManager, objectFactory, blueprintEditor;

function init() {
    sceneManager = new SceneManager();
    objectFactory = new ObjectFactory(sceneManager);
    exportManager = new ExportManager(sceneManager);
    blueprintEditor = new BlueprintEditor(sceneManager);
    uiManager = new UIManager(sceneManager, objectFactory, exportManager);

    uiManager.setBlueprintEditor(blueprintEditor);
    exportManager.setBlueprintEditor(blueprintEditor);
    
    uiManager.setupEventHandlers();
    sceneManager.animate();

    exportManager.startAnimationLoop();
    
    console.log('Редактор запущен');
    console.log('📋 Для создания блюпринтов нажмите кнопку "📋" рядом с объектом в иерархии');
    console.log('▶ Для тестирования блюпринтов нажмите кнопку "▶"');
}

init();