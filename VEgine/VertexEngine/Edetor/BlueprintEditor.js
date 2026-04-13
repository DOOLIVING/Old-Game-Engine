export class BlueprintEditor {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.currentObjectId = null;
        this.blueprints = new Map();
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draggingNode = null;
        this.draggingConnection = null;
        this.dragOffset = { x: 0, y: 0 };
        this.nextNodeId = 1;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.createPanel();
        this.createCanvas();
        this.setupEventListeners();
        this.addNodeTypes();
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'blueprint-panel';
        panel.style.cssText = `
            position: fixed;
            left: 0;
            top: 60px;
            width: 250px;
            height: calc(100% - 60px);
            background: #2a2a2a;
            border-right: 2px solid #444;
            padding: 10px;
            overflow-y: auto;
            z-index: 100;
            display: none;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Редактор блюпринтов';
        title.style.cssText = 'color: white; margin: 0 0 10px 0; padding: 5px; text-align: center;';
        panel.appendChild(title);
        
        this.currentObjectDisplay = document.createElement('div');
        this.currentObjectDisplay.style.cssText = `
            background: #3a3a3a;
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 10px;
            color: #4CAF50;
            font-size: 12px;
            text-align: center;
        `;
        this.currentObjectDisplay.textContent = 'Не выбран объект';
        panel.appendChild(this.currentObjectDisplay);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ Закрыть';
        closeBtn.style.cssText = `
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => this.hidePanel();
        panel.appendChild(closeBtn);
        
        const hr = document.createElement('hr');
        hr.style.cssText = 'margin: 10px 0; border-color: #444;';
        panel.appendChild(hr);
        
        const typesTitle = document.createElement('h4');
        typesTitle.textContent = 'Блоки блюпринтов';
        typesTitle.style.cssText = 'color: white; margin: 5px 0;';
        panel.appendChild(typesTitle);
        
        this.nodeTypesContainer = document.createElement('div');
        this.nodeTypesContainer.id = 'node-types';
        panel.appendChild(this.nodeTypesContainer);
        
        document.body.appendChild(panel);
    }
    
    addNodeTypes() {
        const types = [
            { name: '🎯 Старт', type: 'start', color: '#4CAF50', inputs: [], outputs: ['next'], icon: '▶' },
            { name: '🚶 Шагать', type: 'step', color: '#2196F3', inputs: ['prev'], outputs: ['next'], icon: '👣' },
            { name: '🛑 Остановка', type: 'stop', color: '#f44336', inputs: ['prev'], outputs: [], icon: '⏹' },
            { name: '💥 Столкновение', type: 'collision', color: '#FF9800', inputs: ['prev'], outputs: ['next'], icon: '💢' },
            { name: '🎮 Управление', type: 'control', color: '#9C27B0', inputs: ['prev'], outputs: ['next'], icon: '🎮' },
            { name: '⚡ Физика', type: 'physics', color: '#00BCD4', inputs: ['prev'], outputs: ['next'], icon: '⚡' },
            { name: '🔄 Повтор', type: 'repeat', color: '#E91E63', inputs: ['prev'], outputs: ['next', 'loop'], icon: '🔄' },
            { name: '⏱ Задержка', type: 'delay', color: '#FF5722', inputs: ['prev'], outputs: ['next'], icon: '⏱' },
            { name: '🔊 Звук', type: 'sound', color: '#795548', inputs: ['prev'], outputs: ['next'], icon: '🔊' },
            { name: '📝 Лог', type: 'log', color: '#607D8B', inputs: ['prev'], outputs: ['next'], icon: '📝' }
        ];
        
        types.forEach(typeInfo => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'blueprint-node-type';
            nodeDiv.innerHTML = `${typeInfo.icon} ${typeInfo.name}`;
            nodeDiv.setAttribute('data-type', typeInfo.type);
            nodeDiv.setAttribute('data-color', typeInfo.color);
            nodeDiv.setAttribute('data-inputs', JSON.stringify(typeInfo.inputs));
            nodeDiv.setAttribute('data-outputs', JSON.stringify(typeInfo.outputs));
            nodeDiv.style.cssText = `
                background: ${typeInfo.color};
                color: white;
                padding: 8px;
                margin: 5px 0;
                border-radius: 5px;
                cursor: grab;
                text-align: center;
                font-size: 12px;
                user-select: none;
                transition: transform 0.2s;
            `;
            
            nodeDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: typeInfo.type,
                    color: typeInfo.color,
                    inputs: typeInfo.inputs,
                    outputs: typeInfo.outputs,
                    name: typeInfo.name,
                    icon: typeInfo.icon
                }));
                e.dataTransfer.effectAllowed = 'copy';
            });
            
            nodeDiv.setAttribute('draggable', 'true');
            this.nodeTypesContainer.appendChild(nodeDiv);
        });
    }
    
    createCanvas() {
        const canvas = document.createElement('div');
        canvas.id = 'blueprint-canvas';
        canvas.style.cssText = `
            position: fixed;
            left: 250px;
            top: 60px;
            right: 0;
            bottom: 0;
            background: #1e1e1e;
            background-image: 
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 25px 25px;
            overflow: auto;
            z-index: 99;
            display: none;
        `;
        
        this.canvas = canvas;
        document.body.appendChild(canvas);
        
        this.nodesContainer = document.createElement('div');
        this.nodesContainer.id = 'blueprint-nodes';
        this.nodesContainer.style.cssText = `
            position: relative;
            min-width: 3000px;
            min-height: 3000px;
        `;
        canvas.appendChild(this.nodesContainer);
        
        this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        this.nodesContainer.appendChild(this.svgContainer);
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scrollLeft = this.canvas.scrollLeft;
            const scrollTop = this.canvas.scrollTop;
            
            const x = e.clientX - rect.left + scrollLeft - 100;
            const y = e.clientY - rect.top + scrollTop - 60;
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            this.createNode(data.type, x, y, data.color, data.inputs, data.outputs, data.name, data.icon);
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas || e.target === this.nodesContainer) {
                this.selectNode(null);
            }
        });
    }
    
    createNode(type, x, y, color, inputs, outputs, displayName, icon = '📦') {
        const id = this.nextNodeId++;
        const node = {
            id: id,
            type: type,
            name: displayName,
            icon: icon,
            x: x,
            y: y,
            color: color,
            inputs: inputs,
            outputs: outputs,
            properties: this.getDefaultProperties(type)
        };
        
        const nodeElement = this.createNodeElement(node);
        node.element = nodeElement;
        
        this.nodes.push(node);
        this.nodesContainer.appendChild(nodeElement);
        this.makeDraggable(nodeElement, node);
        this.updateConnections();
        this.saveBlueprint();
        
        return node;
    }
    
    getDefaultProperties(type) {
        switch(type) {
            case 'start':
                return { description: 'Начало выполнения' };
            case 'step':
                return { x: 1, y: 0, z: 0, speed: 1, duration: 1 };
            case 'stop':
                return { x: 0, y: 0, z: 0 };
            case 'collision':
                return { objectName: '', action: 'stop', message: 'Произошло столкновение!' };
            case 'control':
                return { forward: 'W', backward: 'S', left: 'A', right: 'D', jump: 'Space', speed: 5 };
            case 'physics':
                return { enabled: true, mass: 1, gravity: 9.8, friction: 0.5 };
            case 'repeat':
                return { condition: 'forever', count: 10, waitBetween: 0 };
            case 'delay':
                return { seconds: 1 };
            case 'sound':
                return { soundName: 'click.mp3', volume: 0.7, loop: false };
            case 'log':
                return { message: 'Выполняется действие', level: 'info' };
            default:
                return {};
        }
    }
    
    createNodeElement(node) {
        const div = document.createElement('div');
        div.className = 'blueprint-node';
        div.setAttribute('data-id', node.id);
        div.style.cssText = `
            position: absolute;
            left: ${node.x}px;
            top: ${node.y}px;
            background: ${node.color};
            border-radius: 10px;
            min-width: 200px;
            background: linear-gradient(135deg, ${node.color}, ${this.darkenColor(node.color, 0.3)});
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none;
            transition: box-shadow 0.2s;
        `;
        
        div.onmouseenter = () => div.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        div.onmouseleave = () => div.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px 10px 0 0;
            font-weight: bold;
            color: white;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        header.innerHTML = `<span style="font-size: 18px;">${node.icon}</span> ${node.name}`;
        div.appendChild(header);
        
        const properties = document.createElement('div');
        properties.style.cssText = `
            padding: 10px;
            background: rgba(0,0,0,0.1);
            font-size: 11px;
            color: white;
        `;
        
        this.addPropertyInputs(properties, node);
        div.appendChild(properties);
        
        const ports = document.createElement('div');
        ports.style.cssText = `
            display: flex;
            justify-content: space-between;
            padding: 8px;
            background: rgba(0,0,0,0.15);
            border-radius: 0 0 10px 10px;
        `;
        
        const inputsDiv = document.createElement('div');
        inputsDiv.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
        node.inputs.forEach(input => {
            const port = this.createPort(input, 'input', node.id);
            inputsDiv.appendChild(port);
        });
        
        const outputsDiv = document.createElement('div');
        outputsDiv.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;';
        node.outputs.forEach(output => {
            const port = this.createPort(output, 'output', node.id);
            outputsDiv.appendChild(port);
        });
        
        ports.appendChild(inputsDiv);
        ports.appendChild(outputsDiv);
        div.appendChild(ports);
        
        const deleteBtn = document.createElement('div');
        deleteBtn.innerHTML = '✖';
        deleteBtn.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #f44336;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: transform 0.1s;
        `;
        deleteBtn.onmouseover = () => deleteBtn.style.transform = 'scale(1.1)';
        deleteBtn.onmouseout = () => deleteBtn.style.transform = 'scale(1)';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.deleteNode(node.id);
        };
        div.appendChild(deleteBtn);
        
        return div;
    }
    
    createPort(name, type, nodeId) {
        const port = document.createElement('div');
        port.className = `blueprint-port ${type}`;
        port.textContent = name;
        port.setAttribute('data-node', nodeId);
        port.setAttribute('data-port', name);
        port.setAttribute('data-port-type', type);
        port.style.cssText = `
            background: rgba(255,255,255,0.25);
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.2s;
            font-weight: bold;
        `;
        
        port.addEventListener('mouseenter', () => {
            port.style.background = 'rgba(255,255,255,0.4)';
            port.style.transform = 'scale(1.05)';
        });
        
        port.addEventListener('mouseleave', () => {
            port.style.background = 'rgba(255,255,255,0.25)';
            port.style.transform = 'scale(1)';
        });
        
        port.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startConnection(nodeId, name, type);
        });
        
        return port;
    }
    
    addPropertyInputs(container, node) {
        const props = node.properties;
        
        for (const [key, value] of Object.entries(props)) {
            const propDiv = document.createElement('div');
            propDiv.style.cssText = 'margin: 5px 0; display: flex; align-items: center; gap: 8px;';
            
            const label = document.createElement('label');
            label.textContent = this.formatKey(key) + ': ';
            label.style.cssText = 'flex: 1; font-size: 11px;';
            
            let input;
            if (typeof value === 'boolean') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = value;
                input.addEventListener('change', (e) => {
                    node.properties[key] = e.target.checked;
                    this.onPropertyChange(node);
                });
            } else if (typeof value === 'number') {
                input = document.createElement('input');
                input.type = 'number';
                input.value = value;
                input.step = key === 'seconds' ? 0.1 : 1;
                input.style.width = '70px';
                input.style.background = 'rgba(255,255,255,0.2)';
                input.style.color = 'white';
                input.style.border = 'none';
                input.style.borderRadius = '3px';
                input.style.padding = '3px';
                input.addEventListener('change', (e) => {
                    node.properties[key] = parseFloat(e.target.value);
                    this.onPropertyChange(node);
                });
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                input.style.width = '100px';
                input.style.background = 'rgba(255,255,255,0.2)';
                input.style.color = 'white';
                input.style.border = 'none';
                input.style.borderRadius = '3px';
                input.style.padding = '3px';
                input.addEventListener('change', (e) => {
                    node.properties[key] = e.target.value;
                    this.onPropertyChange(node);
                });
            }
            
            propDiv.appendChild(label);
            propDiv.appendChild(input);
            container.appendChild(propDiv);
        }
    }
    
    formatKey(key) {
        const translations = {
            x: 'X координата', y: 'Y координата', z: 'Z координата',
            speed: 'Скорость', duration: 'Длительность', objectName: 'Имя объекта',
            action: 'Действие', message: 'Сообщение', forward: 'Вперёд',
            backward: 'Назад', left: 'Влево', right: 'Вправо', jump: 'Прыжок',
            enabled: 'Включена', mass: 'Масса', gravity: 'Гравитация', friction: 'Трение',
            condition: 'Условие', count: 'Количество', waitBetween: 'Пауза между',
            seconds: 'Секунды', soundName: 'Звуковой файл', volume: 'Громкость',
            loop: 'Зациклить', level: 'Уровень', description: 'Описание'
        };
        return translations[key] || key;
    }
    
    startConnection(nodeId, portName, portType) {
        this.draggingConnection = {
            fromNode: nodeId,
            fromPort: portName,
            fromType: portType,
            toNode: null,
            toPort: null
        };
        
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
    
    onMouseMove(e) {
        if (!this.draggingConnection) return;
        
        if (this.tempLine) {
            this.tempLine.remove();
        }
        
        const fromPort = document.querySelector(`[data-node="${this.draggingConnection.fromNode}"][data-port="${this.draggingConnection.fromPort}"]`);
        if (fromPort) {
            const fromRect = fromPort.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            
            const startX = fromRect.left + fromRect.width/2 - canvasRect.left + this.canvas.scrollLeft;
            const startY = fromRect.top + fromRect.height/2 - canvasRect.top + this.canvas.scrollTop;
            const endX = e.clientX - canvasRect.left + this.canvas.scrollLeft;
            const endY = e.clientY - canvasRect.top + this.canvas.scrollTop;
            
            this.tempLine = this.drawLine(startX, startY, endX, endY, '#ffffff', true);
        }
    }
    
    onMouseUp(e) {
        if (!this.draggingConnection) return;
        
        const element = document.elementsFromPoint(e.clientX, e.clientY);
        const targetPort = element.find(el => el.classList && el.classList.contains('blueprint-port'));
        
        if (targetPort && targetPort !== document.querySelector(`[data-node="${this.draggingConnection.fromNode}"][data-port="${this.draggingConnection.fromPort}"]`)) {
            const toNodeId = parseInt(targetPort.getAttribute('data-node'));
            const toPortName = targetPort.getAttribute('data-port');
            const toPortType = targetPort.getAttribute('data-port-type');
            
            if (this.draggingConnection.fromType !== toPortType) {
                this.addConnection(
                    this.draggingConnection.fromNode,
                    this.draggingConnection.fromPort,
                    toNodeId,
                    toPortName
                );
            }
        }
        
        if (this.tempLine) {
            this.tempLine.remove();
            this.tempLine = null;
        }
        
        this.draggingConnection = null;
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }
    
    addConnection(fromNodeId, fromPort, toNodeId, toPort) {
        const exists = this.connections.some(conn => 
            conn.fromNode === fromNodeId && 
            conn.fromPort === fromPort && 
            conn.toNode === toNodeId && 
            conn.toPort === toPort
        );
        
        if (!exists) {
            this.connections.push({
                fromNode: fromNodeId,
                fromPort: fromPort,
                toNode: toNodeId,
                toPort: toPort
            });
            this.updateConnections();
            this.saveBlueprint();
        }
    }
    
    updateConnections() {
        while (this.svgContainer.firstChild) {
            this.svgContainer.removeChild(this.svgContainer.firstChild);
        }
        
        this.connections.forEach(conn => {
            const fromPort = document.querySelector(`[data-node="${conn.fromNode}"][data-port="${conn.fromPort}"]`);
            const toPort = document.querySelector(`[data-node="${conn.toNode}"][data-port="${conn.toPort}"]`);
            
            if (fromPort && toPort) {
                const fromRect = fromPort.getBoundingClientRect();
                const toRect = toPort.getBoundingClientRect();
                const canvasRect = this.canvas.getBoundingClientRect();
                
                const startX = fromRect.left + fromRect.width/2 - canvasRect.left + this.canvas.scrollLeft;
                const startY = fromRect.top + fromRect.height/2 - canvasRect.top + this.canvas.scrollTop;
                const endX = toRect.left + toRect.width/2 - canvasRect.left + this.canvas.scrollLeft;
                const endY = toRect.top + toRect.height/2 - canvasRect.top + this.canvas.scrollTop;
                
                this.drawLine(startX, startY, endX, endY, '#88ff88', false);
            }
        });
    }
    
    drawLine(x1, y1, x2, y2, color, isTemp = false) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        const dx = Math.abs(x2 - x1);
        const controlPoint = Math.min(dx, 200);
        const path = `M ${x1} ${y1} C ${x1 + controlPoint} ${y1}, ${x2 - controlPoint} ${y2}, ${x2} ${y2}`;
        
        line.setAttribute('d', path);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', isTemp ? '2' : '3');
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-dasharray', isTemp ? '5,5' : '');
        
        if (!isTemp) {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const arrowSize = 8;
            const arrowX = x2;
            const arrowY = y2;
            
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const points = [
                [arrowX, arrowY],
                [arrowX - arrowSize * Math.cos(angle - Math.PI/6), arrowY - arrowSize * Math.sin(angle - Math.PI/6)],
                [arrowX - arrowSize * Math.cos(angle + Math.PI/6), arrowY - arrowSize * Math.sin(angle + Math.PI/6)]
            ];
            arrow.setAttribute('points', points.map(p => p.join(',')).join(' '));
            arrow.setAttribute('fill', color);
            this.svgContainer.appendChild(arrow);
        }
        
        this.svgContainer.appendChild(line);
        return line;
    }
    
    makeDraggable(element, node) {
        let isDragging = false;
        let startX, startY;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target.classList && e.target.classList.contains('blueprint-port')) return;
            if (e.target.parentElement && e.target.parentElement.classList && e.target.parentElement.classList.contains('blueprint-port')) return;
            
            isDragging = true;
            startX = e.clientX - node.x;
            startY = e.clientY - node.y;
            element.style.cursor = 'grabbing';
            
            const onMouseMove = (moveEvent) => {
                if (isDragging) {
                    node.x = moveEvent.clientX - startX;
                    node.y = moveEvent.clientY - startY;
                    element.style.left = node.x + 'px';
                    element.style.top = node.y + 'px';
                    this.updateConnections();
                }
            };
            
            const onMouseUp = () => {
                isDragging = false;
                element.style.cursor = 'move';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.saveBlueprint();
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
    
    deleteNode(nodeId) {
        const index = this.nodes.findIndex(n => n.id === nodeId);
        if (index !== -1) {
            this.nodes[index].element.remove();
            this.nodes.splice(index, 1);
            
            this.connections = this.connections.filter(conn => 
                conn.fromNode !== nodeId && conn.toNode !== nodeId
            );
            
            this.updateConnections();
            this.saveBlueprint();
        }
    }
    
    selectNode(node) {
        this.selectedNode = node;
    }
    
    onPropertyChange(node) {
        console.log(`Изменено свойство для ${node.name}:`, node.properties);
        this.saveBlueprint();
    }
    
    openForObject(objectId, objectName) {
        this.currentObjectId = objectId;
        this.currentObjectDisplay.textContent = `Редактирование: ${objectName}`;
        
        this.loadBlueprint();
        
        document.getElementById('blueprint-panel').style.display = 'block';
        document.getElementById('blueprint-canvas').style.display = 'block';
        this.isVisible = true;
    }
    
    hidePanel() {
        document.getElementById('blueprint-panel').style.display = 'none';
        document.getElementById('blueprint-canvas').style.display = 'none';
        this.currentObjectId = null;
        this.isVisible = false;
    }
    
    saveBlueprint() {
        if (this.currentObjectId === null) return;
        
        const blueprintData = {
            nodes: this.nodes.map(node => ({
                id: node.id,
                type: node.type,
                name: node.name,
                icon: node.icon,
                x: node.x,
                y: node.y,
                color: node.color,
                inputs: node.inputs,
                outputs: node.outputs,
                properties: node.properties
            })),
            connections: this.connections,
            nextNodeId: this.nextNodeId
        };
        
        this.blueprints.set(this.currentObjectId, blueprintData);
        localStorage.setItem(`blueprint_${this.currentObjectId}`, JSON.stringify(blueprintData));
        
        console.log(`Блюпринты сохранены для объекта ${this.currentObjectId}`);
    }
    
    loadBlueprint() {
        this.nodes.forEach(node => {
            if (node.element) node.element.remove();
        });
        this.nodes = [];
        this.connections = [];
        
        const saved = localStorage.getItem(`blueprint_${this.currentObjectId}`);
        if (saved) {
            const blueprintData = JSON.parse(saved);
            blueprintData.nodes.forEach(nodeData => {
                const node = {
                    ...nodeData,
                    element: null
                };
                const nodeElement = this.createNodeElement(node);
                node.element = nodeElement;
                this.nodes.push(node);
                this.nodesContainer.appendChild(nodeElement);
                this.makeDraggable(nodeElement, node);
            });
            this.connections = blueprintData.connections;
            this.nextNodeId = blueprintData.nextNodeId;
            this.updateConnections();
            console.log(`Блюпринты загружены для объекта ${this.currentObjectId}`);
        } else {
            console.log(`Новые блюпринты для объекта ${this.currentObjectId}`);
        }
    }
    
    darkenColor(color, amount = 0.2) {
        return color;
    }

    getBlueprintsMap() {
        return this.blueprints;
    }
}
