import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/TransformControls.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.transformControls = null;
        this.selectedObject = null;
        this.objects = [];
        this.nextId = 1;
        
        this.init();
    }
    
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        const viewport = document.querySelector('.viewport');
        this.camera = new THREE.PerspectiveCamera(45, viewport.clientWidth / viewport.clientHeight, 0.1, 1000);
        this.camera.position.set(20, 20, 20);
        
        const canvas = document.getElementById('editor-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        this.renderer.shadowMap.enabled = true;
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('dragging-changed', (e) => this.controls.enabled = !e.value);
        this.transformControls.addEventListener('objectChange', () => this.updateInspector());
        this.scene.add(this.transformControls);
        
        // Свет в редакторе
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(10, 20, 10);
        sun.castShadow = true;
        this.scene.add(sun);
        this.scene.add(new THREE.GridHelper(100, 50));
        
        this.setupRaycaster();
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupRaycaster() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.objects.map(o => o.mesh), true);
            if (intersects.length > 0) {
                let hit = intersects[0].object;
                while (hit.parent && !this.objects.find(o => o.mesh === hit)) hit = hit.parent;
                this.selectObject(this.objects.find(o => o.mesh === hit));
            }
        });
    }
    
    selectObject(obj) {
        this.selectedObject = obj;
        if (obj) {
            this.transformControls.attach(obj.mesh);
            this.updateInspector();
        } else {
            this.transformControls.detach();
        }
    }
    
    updateInspector() {
        if (!this.selectedObject) return;
        const p = this.selectedObject.mesh.position;
        const posXInput = document.getElementById('pos-x');
        const posYInput = document.getElementById('pos-y');
        const posZInput = document.getElementById('pos-z');
        const objNameInput = document.getElementById('obj-name');
        
        if (posXInput) posXInput.value = p.x.toFixed(1);
        if (posYInput) posYInput.value = p.y.toFixed(1);
        if (posZInput) posZInput.value = p.z.toFixed(1);
        if (objNameInput) objNameInput.value = this.selectedObject.name;
    }
    
    addObject(obj) {
        obj.id = this.nextId++;
        this.objects.push(obj);
        this.scene.add(obj.mesh);
        this.selectObject(obj);
        return obj;
    }
    
    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
            this.scene.remove(obj.mesh);
            if (this.selectedObject === obj) {
                this.selectObject(null);
            }
        }
    }
    
    getObjects() {
        return this.objects;
    }
    
    getCamera() {
        return this.camera;
    }
    
    onWindowResize() {
        const v = document.querySelector('.viewport');
        this.camera.aspect = v.clientWidth / v.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(v.clientWidth, v.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}