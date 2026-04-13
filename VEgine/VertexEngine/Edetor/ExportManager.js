export class ExportManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.blueprintEditor = null;
        this.activeExecutors = new Map();
        this.animationId = null;
    }
    
    setBlueprintEditor(editor) {
        this.blueprintEditor = editor;
    }
    
    startBlueprint(objectId) {
        if (!this.blueprintEditor) return;
        
        const blueprintData = this.getBlueprintData(objectId);
        if (!blueprintData || !blueprintData.nodes || blueprintData.nodes.length === 0) {
            console.log(`Нет блюпринтов для объекта ${objectId}`);
            return;
        }
        
        if (this.activeExecutors.has(objectId)) {
            this.stopBlueprint(objectId);
        }
        
        const obj = this.sceneManager.getObjects().find(o => o.id === objectId);
        if (!obj) {
            console.log(`Объект ${objectId} не найден`);
            return;
        }
        
        const executor = new BlueprintRuntimeEditor(objectId, blueprintData, obj, this.sceneManager);
        this.activeExecutors.set(objectId, executor);
        executor.start();
        
        console.log(`Запущен блюпринт для объекта ${obj.name}`);
    }
    
    stopBlueprint(objectId) {
        const executor = this.activeExecutors.get(objectId);
        if (executor) {
            executor.stop();
            this.activeExecutors.delete(objectId);
            console.log(`⏹ Остановлен блюпринт для объекта ${objectId}`);
        }
    }
    
    getBlueprintData(objectId) {
        if (!this.blueprintEditor) return null;
        
        const blueprintsMap = this.blueprintEditor.blueprints;
        if (blueprintsMap && blueprintsMap.has(objectId)) {
            return blueprintsMap.get(objectId);
        }
        
        const saved = localStorage.getItem(`blueprint_${objectId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        
        return null;
    }
    
    updateBlueprints() {
        for (const [objectId, executor] of this.activeExecutors) {
            executor.update();
        }
    }
    
    startAnimationLoop() {
        if (this.animationId) return;
        
        const update = () => {
            this.updateBlueprints();
            this.animationId = requestAnimationFrame(update);
        };
        update();
    }
    
    testBlueprintInEditor(objectId) {
        const blueprintData = this.getBlueprintData(objectId);
        if (!blueprintData || !blueprintData.nodes || blueprintData.nodes.length === 0) {
            console.log('Нет блюпринтов для тестирования');
            return;
        }
        
        const obj = this.sceneManager.getObjects().find(o => o.id === objectId);
        if (!obj) {
            console.log('Объект не найден');
            return;
        }
        
        console.log(`Тестирование блюпринта для объекта "${obj.name}"`);
        this.startBlueprint(objectId);
    }
    
    exportToGameEngine() {
        const camera = this.sceneManager.getCamera();
        const objects = this.sceneManager.getObjects();
        
        let gameCode = `// ============================================
// ГЕНЕРИРОВАНО ИЗ РЕДАКТОРА VERTEX
// ============================================

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { SceneBase } from './Scene.js';
import { Cube } from './Cube.js';
import { Sphere } from './Sphere.js';
import { Light } from './Light.js';
import { Model } from './Model.js';
import { Button, Texts } from './UI.js';
import { Camera } from './Camera.js';

// ============================================
// РАНТАЙМ ДЛЯ ВЫПОЛНЕНИЯ БЛЮПРИНТОВ
// ============================================

class BlueprintRuntime {
    constructor(objectId, blueprintData, gameObject) {
        this.objectId = objectId;
        this.gameObject = gameObject;
        this.nodes = blueprintData.nodes || [];
        this.connections = blueprintData.connections || [];
        this.isRunning = false;
        this.currentNode = null;
        this.waitingPromise = null;
        this.moveAnimationId = null;
        this.keyState = {};
        this.controls = {
            forward: 'w',
            backward: 's',
            left: 'a',
            right: 'd',
            speed: 5,
            enabled: false
        };
        this.physicsEnabled = false;
        this.physicsVelocityY = 0;
        this.physicsGravity = 9.8;
        this.physicsGroundY = 0;
        
        this.setupControls();
    }
    
    getPosition() {
        return this.gameObject;
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keyState[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keyState[e.key.toLowerCase()] = false;
        });
    }
    
    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const startNode = this.nodes.find(n => n.type === 'start');
        if (startNode) {
            await this.executeNode(startNode);
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.waitingPromise) {
            clearTimeout(this.waitingPromise);
            this.waitingPromise = null;
        }
        if (this.moveAnimationId) {
            cancelAnimationFrame(this.moveAnimationId);
            this.moveAnimationId = null;
        }
    }
    
    update() {
        if (!this.gameObject) return;
        
        if (this.controls.enabled) {
            this.updateControlMovement();
        }
        
        if (this.physicsEnabled && this.gameObject.pb) {
            this.updatePhysics();
        }
    }
    
    updateControlMovement() {
        let moveX = 0, moveZ = 0;
        
        if (this.keyState[this.controls.forward]) moveZ -= 1;
        if (this.keyState[this.controls.backward]) moveZ += 1;
        if (this.keyState[this.controls.left]) moveX -= 1;
        if (this.keyState[this.controls.right]) moveX += 1;
        
        if (moveX !== 0 || moveZ !== 0) {
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
            
            this.gameObject.x += moveX * this.controls.speed * 0.016;
            this.gameObject.z += moveZ * this.controls.speed * 0.016;
        }
    }
    
    updatePhysics() {
        this.physicsVelocityY -= this.physicsGravity * 0.016;
        this.gameObject.y += this.physicsVelocityY * 0.016;
        
        if (this.gameObject.y - (this.gameObject.size / 2) <= 0) {
            this.gameObject.y = 0 + (this.gameObject.size / 2);
            this.physicsVelocityY = 0;
        }
    }
    
    async executeNode(node) {
        if (!this.isRunning) return;
        this.currentNode = node;
        
        console.log(\`[Blueprint] \${node.name} - выполняется\`);
        
        switch(node.type) {
            case 'step':
                await this.executeStep(node);
                break;
            case 'stop':
                this.executeStop(node);
                break;
            case 'delay':
                await this.executeDelay(node);
                break;
            case 'log':
                this.executeLog(node);
                break;
            case 'repeat':
                await this.executeRepeat(node);
                break;
            case 'control':
                this.executeControl(node);
                break;
            case 'physics':
                this.executePhysics(node);
                break;
            case 'collision':
                this.executeCollision(node);
                break;
            case 'sound':
                this.executeSound(node);
                break;
        }
        
        const nextConn = this.connections.find(c => c.fromNode === node.id && c.fromPort === 'next');
        if (nextConn && this.isRunning) {
            const nextNode = this.nodes.find(n => n.id === nextConn.toNode);
            if (nextNode) {
                await this.executeNode(nextNode);
            }
        }
    }
    
    executeStep(node) {
        return new Promise((resolve) => {
            const props = node.properties;
            const startX = this.gameObject.x;
            const startY = this.gameObject.y;
            const startZ = this.gameObject.z;
            const targetX = startX + (props.x || 0);
            const targetY = startY + (props.y || 0);
            const targetZ = startZ + (props.z || 0);
            const duration = (props.duration || 1) * 1000;
            const startTime = performance.now();
            
            console.log(\` Шагаем с (\${startX.toFixed(1)}, \${startY.toFixed(1)}, \${startZ.toFixed(1)}) на (\${targetX.toFixed(1)}, \${targetY.toFixed(1)}, \${targetZ.toFixed(1)}) за \${duration/1000}сек\`);
            
            const animate = (currentTime) => {
                if (!this.isRunning) {
                    resolve();
                    return;
                }
                
                const elapsed = currentTime - startTime;
                const t = Math.min(1, elapsed / duration);
                
                this.gameObject.x = startX + (targetX - startX) * t;
                this.gameObject.y = startY + (targetY - startY) * t;
                this.gameObject.z = startZ + (targetZ - startZ) * t;
                
                if (t < 1) {
                    this.moveAnimationId = requestAnimationFrame(animate);
                } else {
                    this.moveAnimationId = null;
                    console.log(\`   Шаг завершён! Позиция: (\${this.gameObject.x.toFixed(1)}, \${this.gameObject.y.toFixed(1)}, \${this.gameObject.z.toFixed(1)})\`);
                    resolve();
                }
            };
            
            this.moveAnimationId = requestAnimationFrame(animate);
        });
    }
    
    executeStop(node) {
        const props = node.properties;
        this.gameObject.x = props.x || 0;
        this.gameObject.y = props.y || 0;
        this.gameObject.z = props.z || 0;
        console.log(\`  Остановка в позиции (\${props.x}, \${props.y}, \${props.z})\`);
    }
    
    executeDelay(node) {
        const props = node.properties;
        const seconds = props.seconds || 1;
        console.log(\`  ⏱ Задержка \${seconds} сек\`);
        return new Promise(resolve => {
            this.waitingPromise = setTimeout(() => {
                this.waitingPromise = null;
                resolve();
            }, seconds * 1000);
        });
    }
    
    executeLog(node) {
        const props = node.properties;
        console.log(\`   \${props.message || 'Выполнено действие'}\`);
    }
    
    async executeRepeat(node) {
        const props = node.properties;
        const maxCount = props.condition === 'forever' ? 999999 : (props.count || 10);
        const waitBetween = props.waitBetween || 0;
        
        const loopConn = this.connections.find(c => c.fromNode === node.id && c.fromPort === 'loop');
        const nextConn = this.connections.find(c => c.fromNode === node.id && c.fromPort === 'next');
        
        if (loopConn) {
            const loopNode = this.nodes.find(n => n.id === loopConn.toNode);
            
            for (let i = 0; i < maxCount && this.isRunning; i++) {
                console.log(\`   Повтор \${i + 1}/\${maxCount === 999999 ? '∞' : maxCount}\`);
                if (loopNode) {
                    await this.executeNode(loopNode);
                }
                if (waitBetween > 0 && i < maxCount - 1) {
                    await this.executeDelay({ properties: { seconds: waitBetween } });
                }
            }
        }
        
        if (nextConn && this.isRunning && maxCount !== 999999) {
            const nextNode = this.nodes.find(n => n.id === nextConn.toNode);
            if (nextNode) {
                await this.executeNode(nextNode);
            }
        }
    }
    
    executeControl(node) {
        const props = node.properties;
        this.controls = {
            forward: (props.forward || 'w').toLowerCase(),
            backward: (props.backward || 's').toLowerCase(),
            left: (props.left || 'a').toLowerCase(),
            right: (props.right || 'd').toLowerCase(),
            speed: props.speed || 5,
            enabled: true
        };
        console.log(\`   Управление настроено: WASD для движения\`);
    }
    
    executePhysics(node) {
        const props = node.properties;
        this.physicsEnabled = props.enabled || false;
        this.physicsGravity = props.gravity || 9.8;
        this.physicsGroundY = this.gameObject.y - (this.gameObject.size / 2);
        this.physicsVelocityY = 0;
        console.log(\`  ⚡ Физика: \${this.physicsEnabled ? 'ВКЛ' : 'ВЫКЛ'}\`);
    }
    
    executeCollision(node) {
        const props = node.properties;
        console.log(\`   Столкновение с "\${props.objectName || 'любым'}": \${props.action || 'stop'}\`);
    }
    
    executeSound(node) {
        const props = node.properties;
        console.log(\`   Звук: \${props.soundName}\`);
    }
}

// ============================================
// МЕНЮ
// ============================================

export class MenuScene extends SceneBase {
    constructor(threeScene, width, height, onStart) {
        super(threeScene);
        this.worldTexts.push(new Texts(width/2 - 250, 150, 255, 255, 255, "VERTEX ENGINE", 64));
        this.worldButton.push(new Button(width/2 - 100, height/2, 200, 60, 0, 150, 0, "ИГРАТЬ", onStart));
    }
}

// ============================================
// ИГРОВОЙ УРОВЕНЬ
// ============================================

export class GameLevel extends SceneBase {
    constructor(threeScene, width, height, sceneCamera, keys, onMenu) {
        super(threeScene);
        this.sceneCamera = sceneCamera;
        this.keys = keys;
        this.blueprintRuntimes = new Map();
        
        // Установка позиции камеры из редактора
        if (this.sceneCamera) {
            this.sceneCamera.x = ${camera.position.x};
            this.sceneCamera.y = ${camera.position.y};
            this.sceneCamera.z = ${camera.position.z};
        }
        
        // Создание объектов сцены
`;
        
        objects.forEach(obj => {
            const p = obj.mesh.position;
            const s = obj.mesh.scale;
            const color = obj.color || 0x44aa44;
            const r = ((color >> 16) & 255);
            const g = ((color >> 8) & 255);
            const b = (color & 255);
            
            if (obj.type === 'cube') {
                gameCode += `        const cube_${obj.id} = new Cube(threeScene, ${p.x}, ${p.y}, ${p.z}, ${10 * s.x}, ${r}, ${g}, ${b}, ${obj.physics});\n`;
                gameCode += `        this.worldCubes.push(cube_${obj.id});\n`;
                gameCode += `        this.setupBlueprint(cube_${obj.id}, ${obj.id});\n`;
            } else if (obj.type === 'sphere') {
                gameCode += `        const sphere_${obj.id} = new Sphere(threeScene, ${p.x}, ${p.y}, ${p.z}, ${5 * s.x}, ${r}, ${g}, ${b}, ${obj.physics});\n`;
                gameCode += `        this.worldSphere.push(sphere_${obj.id});\n`;
                gameCode += `        this.setupBlueprint(sphere_${obj.id}, ${obj.id});\n`;
            } else if (obj.type === 'light') {
                gameCode += `        this.worldLight.push(new Light(threeScene, ${r}, ${g}, ${b}, ${p.x}, ${p.y}, ${p.z}));\n`;
            }
        });
        
        gameCode += `
        this.worldButton.push(new Button(20, height - 60, 100, 40, 150, 0, 0, "МЕНЮ", onMenu));
    }
    
    setupBlueprint(gameObject, objectId) {
        const blueprintData = this.getBlueprintData(objectId);
        if (blueprintData && blueprintData.nodes && blueprintData.nodes.length > 0) {
            const runtime = new BlueprintRuntime(objectId, blueprintData, gameObject);
            this.blueprintRuntimes.set(objectId, runtime);
            runtime.start();
            console.log(\`✓ Блюпринт запущен для объекта \${objectId}\`);
        }
    }
    
    getBlueprintData(objectId) {
        const blueprints = ${this.getAllBlueprintsJSON()};
        return blueprints[objectId] || null;
    }
    
    update() {
        super.update();
        
        // Обновление блюпринтов
        for (const [id, runtime] of this.blueprintRuntimes) {
            runtime.update();
        }
        
        const speed = 1.5;
        const rotSpeed = 0.04;

        if (!this.sceneCamera) return;
        
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
        if (this.keys['q']) this.sceneCamera.y -= speed;
        if (this.keys['e']) this.sceneCamera.y += speed;
        if (this.keys['arrowleft']) this.sceneCamera.yaw -= rotSpeed;
        if (this.keys['arrowright']) this.sceneCamera.yaw += rotSpeed;
        if (this.keys['arrowup']) this.sceneCamera.pitch -= rotSpeed;
        if (this.keys['arrowdown']) this.sceneCamera.pitch += rotSpeed;

        if (this.sceneCamera.apply) {
            this.sceneCamera.apply();
        }
    }
}`;
        
        document.getElementById('export-code').textContent = gameCode;
        document.getElementById('export-preview').style.display = 'block';
        
        navigator.clipboard.writeText(gameCode).then(() => {
            console.log('Код скопирован в буфер обмена');
        });
    }
    
    getAllBlueprintsJSON() {
        if (!this.blueprintEditor) return '{}';
        
        const allBlueprints = {};
        
        const blueprintsMap = this.blueprintEditor.blueprints;
        if (blueprintsMap) {
            for (const [objectId, blueprintData] of blueprintsMap) {
                if (blueprintData && blueprintData.nodes && blueprintData.nodes.length > 0) {
                    allBlueprints[objectId] = {
                        nodes: blueprintData.nodes.map(node => ({
                            id: node.id,
                            type: node.type,
                            name: node.name,
                            properties: node.properties,
                            inputs: node.inputs,
                            outputs: node.outputs
                        })),
                        connections: blueprintData.connections
                    };
                }
            }
        }
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('blueprint_')) {
                const objectId = parseInt(key.replace('blueprint_', ''));
                if (!allBlueprints[objectId]) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data && data.nodes && data.nodes.length > 0) {
                            allBlueprints[objectId] = {
                                nodes: data.nodes.map(node => ({
                                    id: node.id,
                                    type: node.type,
                                    name: node.name,
                                    properties: node.properties,
                                    inputs: node.inputs,
                                    outputs: node.outputs
                                })),
                                connections: data.connections
                            };
                        }
                    } catch(e) {}
                }
            }
        }
        
        return JSON.stringify(allBlueprints);
    }
}

class BlueprintRuntimeEditor {
    constructor(objectId, blueprintData, obj, sceneManager) {
        this.objectId = objectId;
        this.obj = obj;
        this.gameObject = obj.mesh;
        this.sceneManager = sceneManager;
        this.nodes = blueprintData.nodes || [];
        this.connections = blueprintData.connections || [];
        this.isRunning = false;
        this.currentNode = null;
        this.waitingPromise = null;
        this.moveAnimationId = null;
        this.keyState = {};
        this.controls = { enabled: false };
        this.physicsEnabled = false;
        
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keyState[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keyState[e.key.toLowerCase()] = false;
        });
    }
    
    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const startNode = this.nodes.find(n => n.type === 'start');
        if (startNode) {
            await this.executeNode(startNode);
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.waitingPromise) {
            clearTimeout(this.waitingPromise);
            this.waitingPromise = null;
        }
        if (this.moveAnimationId) {
            cancelAnimationFrame(this.moveAnimationId);
            this.moveAnimationId = null;
        }
    }
    
    update() {
        if (!this.gameObject) return;
        
        if (this.controls.enabled) {
            let moveX = 0, moveZ = 0;
            if (this.keyState[this.controls.forward]) moveZ -= 1;
            if (this.keyState[this.controls.backward]) moveZ += 1;
            if (this.keyState[this.controls.left]) moveX -= 1;
            if (this.keyState[this.controls.right]) moveX += 1;
            
            if (moveX !== 0 || moveZ !== 0) {
                const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
                moveX /= length;
                moveZ /= length;
                this.gameObject.position.x += moveX * this.controls.speed * 0.016;
                this.gameObject.position.z += moveZ * this.controls.speed * 0.016;
                this.obj.x = this.gameObject.position.x;
                this.obj.z = this.gameObject.position.z;
            }
        }
        
        if (this.physicsEnabled) {
            this.physicsVelocityY -= this.physicsGravity * 0.016;
            this.gameObject.position.y += this.physicsVelocityY * 0.016;
            this.obj.y = this.gameObject.position.y;
            if (this.gameObject.position.y <= this.physicsGroundY) {
                this.gameObject.position.y = this.physicsGroundY;
                this.physicsVelocityY = 0;
            }
        }
    }
    
    async executeNode(node) {
        if (!this.isRunning) return;
        
        console.log(`%c[${node.name}]`, 'color: #4CAF50; font-weight: bold');
        
        switch(node.type) {
            case 'step':
                await this.executeStep(node);
                break;
            case 'stop':
                this.executeStop(node);
                break;
            case 'delay':
                await this.executeDelay(node);
                break;
            case 'log':
                console.log(`   ${node.properties.message || 'Выполнено действие'}`);
                break;
            case 'repeat':
                await this.executeRepeat(node);
                break;
            case 'control':
                this.controls = {
                    forward: (node.properties.forward || 'w').toLowerCase(),
                    backward: (node.properties.backward || 's').toLowerCase(),
                    left: (node.properties.left || 'a').toLowerCase(),
                    right: (node.properties.right || 'd').toLowerCase(),
                    speed: node.properties.speed || 5,
                    enabled: true
                };
                console.log(`   Управление включено (WASD)`);
                break;
            case 'physics':
                this.physicsEnabled = node.properties.enabled || false;
                this.physicsGravity = node.properties.gravity || 9.8;
                this.physicsGroundY = this.gameObject.position.y;
                this.physicsVelocityY = 0;
                console.log(`  Физика: ${this.physicsEnabled ? 'ВКЛ' : 'ВЫКЛ'}`);
                break;
            case 'collision':
                console.log(`  Столкновение с "${node.properties.objectName || 'любым'}"`);
                break;
            case 'sound':
                console.log(`   Звук: ${node.properties.soundName}`);
                break;
        }
        
        const nextConn = this.connections.find(c => c.fromNode === node.id && c.fromPort === 'next');
        if (nextConn && this.isRunning) {
            const nextNode = this.nodes.find(n => n.id === nextConn.toNode);
            if (nextNode) {
                await this.executeNode(nextNode);
            }
        }
    }
    
    executeStep(node) {
        return new Promise((resolve) => {
            const props = node.properties;
            const startX = this.gameObject.position.x;
            const startY = this.gameObject.position.y;
            const startZ = this.gameObject.position.z;
            const targetX = startX + (props.x || 0);
            const targetY = startY + (props.y || 0);
            const targetZ = startZ + (props.z || 0);
            const duration = (props.duration || 1) * 1000;
            const startTime = performance.now();
            
            console.log(` Шагаем X:${props.x || 0} Y:${props.y || 0} Z:${props.z || 0} за ${duration/1000}сек`);
            
            const animate = (currentTime) => {
                if (!this.isRunning) {
                    resolve();
                    return;
                }
                const elapsed = currentTime - startTime;
                const t = Math.min(1, elapsed / duration);
                this.gameObject.position.x = startX + (targetX - startX) * t;
                this.gameObject.position.y = startY + (targetY - startY) * t;
                this.gameObject.position.z = startZ + (targetZ - startZ) * t;
                this.obj.x = this.gameObject.position.x;
                this.obj.y = this.gameObject.position.y;
                this.obj.z = this.gameObject.position.z;
                
                if (t < 1) {
                    this.moveAnimationId = requestAnimationFrame(animate);
                } else {
                    this.moveAnimationId = null;
                    console.log(`   Готово! Позиция: (${this.gameObject.position.x.toFixed(1)}, ${this.gameObject.position.y.toFixed(1)}, ${this.gameObject.position.z.toFixed(1)})`);
                    resolve();
                }
            };
            this.moveAnimationId = requestAnimationFrame(animate);
        });
    }
    
    executeStop(node) {
        const props = node.properties;
        this.gameObject.position.set(props.x || 0, props.y || 0, props.z || 0);
        this.obj.x = props.x || 0;
        this.obj.y = props.y || 0;
        this.obj.z = props.z || 0;
        console.log(`  Остановка в (${props.x}, ${props.y}, ${props.z})`);
    }
    
    executeDelay(node) {
        const seconds = node.properties.seconds || 1;
        console.log(`  Задержка ${seconds} сек`);
        return new Promise(resolve => {
            this.waitingPromise = setTimeout(() => {
                this.waitingPromise = null;
                resolve();
            }, seconds * 1000);
        });
    }
    
    async executeRepeat(node) {
        const props = node.properties;
        const maxCount = props.condition === 'forever' ? 999 : (props.count || 10);
        const loopConn = this.connections.find(c => c.fromNode === node.id && c.fromPort === 'loop');
        
        if (loopConn) {
            const loopNode = this.nodes.find(n => n.id === loopConn.toNode);
            for (let i = 0; i < maxCount && this.isRunning; i++) {
                console.log(`   Повтор ${i + 1}/${maxCount === 999 ? '∞' : maxCount}`);
                if (loopNode) {
                    await this.executeNode(loopNode);
                }
            }
        }
    }
}