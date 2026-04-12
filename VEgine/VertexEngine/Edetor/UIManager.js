export class UIManager {
    constructor(sceneManager, objectFactory, exportManager) {
        this.sceneManager = sceneManager;
        this.objectFactory = objectFactory;
        this.exportManager = exportManager;
    }
    
    setupEventHandlers() {
        const btnCube = document.getElementById('btn-cube');
        const btnSphere = document.getElementById('btn-sphere');
        const btnLight = document.getElementById('btn-light');
        const btnMove = document.getElementById('btn-move');
        const btnRotate = document.getElementById('btn-rotate');
        const btnScale = document.getElementById('btn-scale');
        const btnExport = document.getElementById('btn-export');
        const btnSave = document.getElementById('btn-save');
        
        if (btnCube) btnCube.onclick = () => this.objectFactory.createObject('cube');
        if (btnSphere) btnSphere.onclick = () => this.objectFactory.createObject('sphere');
        if (btnLight) btnLight.onclick = () => this.objectFactory.createObject('light');
        if (btnMove) btnMove.onclick = () => this.sceneManager.transformControls.setMode('translate');
        if (btnRotate) btnRotate.onclick = () => this.sceneManager.transformControls.setMode('rotate');
        if (btnScale) btnScale.onclick = () => this.sceneManager.transformControls.setMode('scale');
        if (btnExport) btnExport.onclick = () => this.exportManager.exportToGameEngine();
        if (btnSave) btnSave.onclick = () => this.saveScene();

        this.addImportButton();

        this.addLoadButton();

        this.setupInspectorListeners();
    }
    
    setupInspectorListeners() {
        const posX = document.getElementById('pos-x');
        const posY = document.getElementById('pos-y');
        const posZ = document.getElementById('pos-z');
        const objName = document.getElementById('obj-name');
        const physicsCheck = document.getElementById('physics-check');
        
        if (posX) {
            posX.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.mesh.position.x = parseFloat(e.target.value);
                    this.sceneManager.updateInspector();
                }
            });
        }
        
        if (posY) {
            posY.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.mesh.position.y = parseFloat(e.target.value);
                    this.sceneManager.updateInspector();
                }
            });
        }
        
        if (posZ) {
            posZ.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.mesh.position.z = parseFloat(e.target.value);
                    this.sceneManager.updateInspector();
                }
            });
        }
        
        if (objName) {
            objName.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.name = e.target.value;
                }
            });
        }
        
        if (physicsCheck) {
            physicsCheck.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.physics = e.target.checked;
                }
            });
        }
    }
    
    saveScene() {
        const sceneData = {
            version: '1.0',
            timestamp: Date.now(),
            camera: {
                position: {
                    x: this.sceneManager.camera.position.x,
                    y: this.sceneManager.camera.position.y,
                    z: this.sceneManager.camera.position.z
                }
            },
            objects: this.sceneManager.getObjects().map(obj => ({
                id: obj.id,
                name: obj.name,
                type: obj.type,
                path: obj.path || null,
                physics: obj.physics,
                position: {
                    x: obj.mesh.position.x,
                    y: obj.mesh.position.y,
                    z: obj.mesh.position.z
                },
                rotation: {
                    x: obj.mesh.rotation.x,
                    y: obj.mesh.rotation.y,
                    z: obj.mesh.rotation.z
                },
                scale: {
                    x: obj.mesh.scale.x,
                    y: obj.mesh.scale.y,
                    z: obj.mesh.scale.z
                },
                color: obj.color || null
            }))
        };
        
        const jsonStr = JSON.stringify(sceneData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scene_${new Date().toISOString().slice(0,19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('Сцена сохранена');
    }
    
    addLoadButton() {
        const loadBtn = document.createElement('button');
        loadBtn.innerText = "Загрузить сцену";
        loadBtn.id = "btn-load";
        loadBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => this.loadScene(e.target.files[0]);
            input.click();
        };
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) toolbar.appendChild(loadBtn);
    }
    
    loadScene(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const sceneData = JSON.parse(e.target.result);

                this.clearScene();
  
                if (sceneData.camera && sceneData.camera.position) {
                    this.sceneManager.camera.position.set(
                        sceneData.camera.position.x,
                        sceneData.camera.position.y,
                        sceneData.camera.position.z
                    );
                }
                
                sceneData.objects.forEach(objData => {
                    this.objectFactory.createObjectFromData(objData);
                });
                
                console.log('Сцена загружена');
            } catch (error) {
                console.error('Ошибка загрузки сцены:', error);
            }
        };
        reader.readAsText(file);
    }
    
    clearScene() {
        const objects = this.sceneManager.getObjects();
        objects.forEach(obj => {
            this.sceneManager.scene.remove(obj.mesh);
        });
        this.sceneManager.objects = [];
        this.sceneManager.selectedObject = null;
        this.sceneManager.transformControls.detach();
    }
    
    addImportButton() {
        const importBtn = document.createElement('button');
        importBtn.innerText = "Импорт .OBJ";
        importBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.obj';
            input.onchange = (e) => this.objectFactory.importModelFromFile(e.target.files[0]);
            input.click();
        };
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) toolbar.appendChild(importBtn);
    }
}