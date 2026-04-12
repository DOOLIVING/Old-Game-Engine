export class UIManager {
    constructor(sceneManager, objectFactory) {
        this.sceneManager = sceneManager;
        this.objectFactory = objectFactory;
    }
    
    setupEventHandlers() {
        const btnCube = document.getElementById('btn-cube');
        const btnSphere = document.getElementById('btn-sphere');
        const btnLight = document.getElementById('btn-light');
        const btnMove = document.getElementById('btn-move');
        const btnRotate = document.getElementById('btn-rotate');
        const btnScale = document.getElementById('btn-scale');
        const btnExport = document.getElementById('btn-export');
        
        if (btnCube) btnCube.onclick = () => this.objectFactory.createObject('cube');
        if (btnSphere) btnSphere.onclick = () => this.objectFactory.createObject('sphere');
        if (btnLight) btnLight.onclick = () => this.objectFactory.createObject('light');
        if (btnMove) btnMove.onclick = () => this.sceneManager.transformControls.setMode('translate');
        if (btnRotate) btnRotate.onclick = () => this.sceneManager.transformControls.setMode('rotate');
        if (btnScale) btnScale.onclick = () => this.sceneManager.transformControls.setMode('scale');
        if (btnExport) btnExport.onclick = () => {
            if (window.exportManager) {
                window.exportManager.exportToGameEngine();
            }
        };
        
        this.addImportButton();
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