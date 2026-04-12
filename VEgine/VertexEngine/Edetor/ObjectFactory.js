import * as THREE from 'three';
import { OBJLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/OBJLoader.js';

export class ObjectFactory {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
    }
    
    createObject(type) {
        let mesh, color = 0x44aa44;
        const id = this.sceneManager.nextId;
        
        if (type === 'cube') {
            mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color }));
        } else if (type === 'sphere') {
            mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xaa4444 }));
        } else if (type === 'light') {
            mesh = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
            mesh.add(new THREE.PointLight(0xffaa00, 1, 300));
        }
        
        mesh.position.y = 5;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        const newObj = { 
            id, 
            name: `${type}_${id}`, 
            type, 
            mesh, 
            physics: false, 
            color 
        };
        
        this.sceneManager.addObject(newObj);
        return newObj;
    }
    
    importModelFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const loader = new OBJLoader();
            const url = URL.createObjectURL(new Blob([e.target.result], { type: 'text/plain' }));
            loader.load(url, (obj) => {
                URL.revokeObjectURL(url);
                const id = this.sceneManager.nextId;
                obj.traverse(c => { 
                    if (c.isMesh) { 
                        c.castShadow = true; 
                        c.receiveShadow = true; 
                    } 
                });
                
                const modelObj = {
                    id, 
                    name: file.name, 
                    type: 'model', 
                    mesh: obj,
                    path: file.name, 
                    physics: false
                };
                
                this.sceneManager.addObject(modelObj);
            });
        };
        reader.readAsText(file);
    }
}