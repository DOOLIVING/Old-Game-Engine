export class UIManager {
    constructor(sceneManager, objectFactory, exportManager) {
        this.sceneManager = sceneManager;
        this.objectFactory = objectFactory;
        this.exportManager = exportManager;
        this.blueprintEditor = null;
    }
    
    setBlueprintEditor(editor) {
        this.blueprintEditor = editor;
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
        const btnLoad = document.getElementById('btn-load');
        const btnNew = document.getElementById('btn-new');
        const btnDelete = document.getElementById('btn-delete');
        const btnDuplicate = document.getElementById('btn-duplicate');
        const btnImportObj = document.getElementById('btn-import-obj');

        if (btnMove) btnMove.onclick = () => this.sceneManager.transformControls.setMode('translate');
        if (btnRotate) btnRotate.onclick = () => this.sceneManager.transformControls.setMode('rotate');
        if (btnScale) btnScale.onclick = () => this.sceneManager.transformControls.setMode('scale');

        if (btnCube) btnCube.onclick = () => this.objectFactory.createObject('cube');
        if (btnSphere) btnSphere.onclick = () => this.objectFactory.createObject('sphere');
        if (btnLight) btnLight.onclick = () => this.objectFactory.createObject('light');

        if (btnExport) btnExport.onclick = () => this.exportManager.exportToGameEngine();
        if (btnSave) btnSave.onclick = () => this.saveScene();
        if (btnLoad) btnLoad.onclick = () => this.loadSceneFromFile();
        if (btnNew) btnNew.onclick = () => this.newScene();
   
        if (btnDelete) btnDelete.onclick = () => this.deleteSelectedObject();
        if (btnDuplicate) btnDuplicate.onclick = () => this.duplicateSelectedObject();

        if (btnImportObj) btnImportObj.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.obj';
            input.onchange = (e) => this.objectFactory.importModelFromFile(e.target.files[0]);
            input.click();
        };

        this.setupTextureHandlers();

        this.setupCameraHandlers();

        this.setupInspectorListeners();

        this.setupHierarchy();

        setInterval(() => this.updateHierarchy(), 100);
    }
    
    setupHierarchy() {
        const hierarchyList = document.getElementById('hierarchy-list');
        if (hierarchyList) {
            hierarchyList.addEventListener('click', (e) => {
                const blueprintBtn = e.target.closest('.blueprint-btn');
                if (blueprintBtn) {
                    e.stopPropagation();
                    const objectId = parseInt(blueprintBtn.getAttribute('data-id'));
                    const objectName = blueprintBtn.getAttribute('data-name');
                    if (this.blueprintEditor) {
                        this.blueprintEditor.openForObject(objectId, objectName);
                    }
                    return;
                }
                
                const testBtn = e.target.closest('.test-btn');
                if (testBtn) {
                    e.stopPropagation();
                    const objectId = parseInt(testBtn.getAttribute('data-id'));
                    if (this.exportManager) {
                        this.exportManager.testBlueprintInEditor(objectId);
                    }
                    return;
                }
                
                const item = e.target.closest('.hierarchy-item');
                if (item) {
                    const objectId = parseInt(item.getAttribute('data-id'));
                    const obj = this.sceneManager.getObjects().find(o => o.id === objectId);
                    if (obj) {
                        this.sceneManager.selectObject(obj);
                    }
                }
            });
        }
    }
    
    updateHierarchy() {
        const hierarchyList = document.getElementById('hierarchy-list');
        if (!hierarchyList) return;
        
        const objects = this.sceneManager.getObjects();
        const selectedObj = this.sceneManager.selectedObject;
        
        hierarchyList.innerHTML = '';
        
        objects.forEach(obj => {
            const item = document.createElement('div');
            item.className = `hierarchy-item ${selectedObj === obj ? 'selected' : ''}`;
            item.setAttribute('data-id', obj.id);
            item.style.cssText = `
                padding: 8px 10px;
                cursor: pointer;
                color: var(--unity-text);
                border-bottom: 1px solid #1e1e1e;
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: space-between;
            `;
            
            const leftPart = document.createElement('div');
            leftPart.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
            leftPart.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    ${this.getObjectIconPath(obj.type)}
                </svg>
                <span>${obj.name}</span>
            `;
            
            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.cssText = 'display: flex; gap: 5px;';
            
            const testBtn = document.createElement('button');
            testBtn.className = 'test-btn';
            testBtn.setAttribute('data-id', obj.id);
            testBtn.innerHTML = '▶';
            testBtn.style.cssText = `
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                width: 28px;
                height: 28px;
                cursor: pointer;
                font-size: 12px;
                transition: transform 0.1s;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            testBtn.title = `Тестировать блюпринт для ${obj.name}`;
            
            const blueprintBtn = document.createElement('button');
            blueprintBtn.className = 'blueprint-btn';
            blueprintBtn.setAttribute('data-id', obj.id);
            blueprintBtn.setAttribute('data-name', obj.name);
            blueprintBtn.innerHTML = '📋';
            blueprintBtn.style.cssText = `
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 3px;
                width: 28px;
                height: 28px;
                cursor: pointer;
                font-size: 14px;
                transition: transform 0.1s;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            blueprintBtn.title = `Редактировать блюпринты для ${obj.name}`;
            
            testBtn.onmouseover = () => testBtn.style.transform = 'scale(1.05)';
            testBtn.onmouseout = () => testBtn.style.transform = 'scale(1)';
            blueprintBtn.onmouseover = () => blueprintBtn.style.transform = 'scale(1.05)';
            blueprintBtn.onmouseout = () => blueprintBtn.style.transform = 'scale(1)';
            
            buttonsDiv.appendChild(testBtn);
            buttonsDiv.appendChild(blueprintBtn);
            
            item.appendChild(leftPart);
            item.appendChild(buttonsDiv);
            
            hierarchyList.appendChild(item);
        });
    }
    
    getObjectIconPath(type) {
        switch(type) {
            case 'cube':
                return '<path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 3.15L5 7.09v7.82l7 3.94 7-3.94V7.09l-7-3.94z"/>';
            case 'sphere':
                return '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>';
            case 'light':
                return '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>';
            default:
                return '<path d="M3 5h2v14H3zm4 0h2v14H7zm4 0h2v14h-2z"/>';
        }
    }
    
    setupTextureHandlers() {
        const btnLoadTexture = document.getElementById('btn-load-texture');
        const btnRemoveTexture = document.getElementById('btn-remove-texture');
        const textureUpload = document.getElementById('texture-upload');
        const texturePreview = document.getElementById('texture-preview');
        const texturePreviewImg = document.getElementById('texture-preview-img');
        
        if (btnLoadTexture) {
            btnLoadTexture.onclick = () => {
                if (textureUpload) textureUpload.click();
            };
        }
        
        if (textureUpload) {
            textureUpload.onchange = (e) => {
                const file = e.target.files[0];
                if (file && this.sceneManager.selectedObject) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const texture = new THREE.TextureLoader().load(ev.target.result);
                        if (this.sceneManager.selectedObject.mesh.material) {
                            this.sceneManager.selectedObject.mesh.material.map = texture;
                            this.sceneManager.selectedObject.mesh.material.needsUpdate = true;
                        }
                        
                        if (texturePreview && texturePreviewImg) {
                            texturePreviewImg.src = ev.target.result;
                            texturePreview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
        
        if (btnRemoveTexture) {
            btnRemoveTexture.onclick = () => {
                if (this.sceneManager.selectedObject && this.sceneManager.selectedObject.mesh.material) {
                    this.sceneManager.selectedObject.mesh.material.map = null;
                    this.sceneManager.selectedObject.mesh.material.needsUpdate = true;
                    if (texturePreview) texturePreview.style.display = 'none';
                }
            };
        }
    }
    
    setupCameraHandlers() {
        const btnSetCamera = document.getElementById('btn-set-camera');
        const btnGotoCamera = document.getElementById('btn-goto-camera');
        const camX = document.getElementById('cam-x');
        const camY = document.getElementById('cam-y');
        const camZ = document.getElementById('cam-z');
        const camYaw = document.getElementById('cam-yaw');
        const camPitch = document.getElementById('cam-pitch');
        
        if (btnSetCamera) {
            btnSetCamera.onclick = () => {
                if (camX) camX.value = this.sceneManager.camera.position.x.toFixed(1);
                if (camY) camY.value = this.sceneManager.camera.position.y.toFixed(1);
                if (camZ) camZ.value = this.sceneManager.camera.position.z.toFixed(1);
            };
        }
        
        if (btnGotoCamera) {
            btnGotoCamera.onclick = () => {
                if (camX && camY && camZ) {
                    this.sceneManager.camera.position.set(
                        parseFloat(camX.value),
                        parseFloat(camY.value),
                        parseFloat(camZ.value)
                    );
                    this.sceneManager.controls.target.set(0, 0, 0);
                    this.sceneManager.controls.update();
                }
            };
        }
    }
    
    setupInspectorListeners() {
        const posX = document.getElementById('pos-x');
        const posY = document.getElementById('pos-y');
        const posZ = document.getElementById('pos-z');
        const rotX = document.getElementById('rot-x');
        const rotY = document.getElementById('rot-y');
        const rotZ = document.getElementById('rot-z');
        const sclX = document.getElementById('scl-x');
        const sclY = document.getElementById('scl-y');
        const sclZ = document.getElementById('scl-z');
        const objName = document.getElementById('obj-name');
        const objColor = document.getElementById('obj-color');
        const physicsCheck = document.getElementById('obj-physics');
        
        const updatePosition = () => {
            if (this.sceneManager.selectedObject) {
                if (posX) this.sceneManager.selectedObject.mesh.position.x = parseFloat(posX.value);
                if (posY) this.sceneManager.selectedObject.mesh.position.y = parseFloat(posY.value);
                if (posZ) this.sceneManager.selectedObject.mesh.position.z = parseFloat(posZ.value);
                this.sceneManager.updateInspector();
            }
        };
        
        const updateRotation = () => {
            if (this.sceneManager.selectedObject) {
                if (rotX) this.sceneManager.selectedObject.mesh.rotation.x = parseFloat(rotX.value) * Math.PI / 180;
                if (rotY) this.sceneManager.selectedObject.mesh.rotation.y = parseFloat(rotY.value) * Math.PI / 180;
                if (rotZ) this.sceneManager.selectedObject.mesh.rotation.z = parseFloat(rotZ.value) * Math.PI / 180;
                this.sceneManager.updateInspector();
            }
        };
        
        const updateScale = () => {
            if (this.sceneManager.selectedObject) {
                if (sclX) this.sceneManager.selectedObject.mesh.scale.x = parseFloat(sclX.value);
                if (sclY) this.sceneManager.selectedObject.mesh.scale.y = parseFloat(sclY.value);
                if (sclZ) this.sceneManager.selectedObject.mesh.scale.z = parseFloat(sclZ.value);
                this.sceneManager.updateInspector();
            }
        };
        
        if (posX) posX.addEventListener('change', updatePosition);
        if (posY) posY.addEventListener('change', updatePosition);
        if (posZ) posZ.addEventListener('change', updatePosition);
        
        if (rotX) rotX.addEventListener('change', updateRotation);
        if (rotY) rotY.addEventListener('change', updateRotation);
        if (rotZ) rotZ.addEventListener('change', updateRotation);
        
        if (sclX) sclX.addEventListener('change', updateScale);
        if (sclY) sclY.addEventListener('change', updateScale);
        if (sclZ) sclZ.addEventListener('change', updateScale);
        
        if (objName) {
            objName.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject) {
                    this.sceneManager.selectedObject.name = e.target.value;
                    this.updateHierarchy();
                }
            });
        }
        
        if (objColor) {
            objColor.addEventListener('change', (e) => {
                if (this.sceneManager.selectedObject && this.sceneManager.selectedObject.mesh.material) {
                    this.sceneManager.selectedObject.mesh.material.color.set(e.target.value);
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
    
    deleteSelectedObject() {
        if (this.sceneManager.selectedObject) {
            this.sceneManager.removeObject(this.sceneManager.selectedObject);
            this.updateHierarchy();
        }
    }
    
    duplicateSelectedObject() {
        if (this.sceneManager.selectedObject) {
            const original = this.sceneManager.selectedObject;
            const newObj = this.objectFactory.createObject(original.type);
            newObj.mesh.position.copy(original.mesh.position);
            newObj.mesh.position.x += 2;
            newObj.name = `${original.name}_copy`;
            this.updateHierarchy();
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
    
    loadSceneFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => this.loadScene(e.target.files[0]);
        input.click();
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
                this.updateHierarchy();
            } catch (error) {
                console.error('Ошибка загрузки сцены:', error);
            }
        };
        reader.readAsText(file);
    }
    
    newScene() {
        if (confirm('Создать новую сцену? Все несохранённые данные будут потеряны!')) {
            this.clearScene();
            this.sceneManager.camera.position.set(20, 20, 20);
            this.sceneManager.controls.target.set(0, 0, 0);
            this.sceneManager.controls.update();
            this.updateHierarchy();
        }
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
}