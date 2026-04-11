export class Button {
    constructor(x, y, sizeX, sizeY, r, g, b, label, callback) {
        this.element = document.createElement('button');
        this.element.innerHTML = label;
        Object.assign(this.element.style, {
            position: 'absolute', left: x + 'px', top: y + 'px', width: sizeX + 'px', height: sizeY + 'px',
            backgroundColor: `rgb(${r},${g},${b})`, color: 'white', border: 'none', borderRadius: '5px',
            cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', zIndex: '100'
        });
        this.element.onclick = callback;
        document.body.appendChild(this.element);
    }
    hide() { this.element.style.display = 'none'; }
}

export class Texts {
    constructor(x, y, r, g, b, label, textSize) {
        this.element = document.createElement('div');
        this.element.innerHTML = label;
        Object.assign(this.element.style, {
            position: 'absolute', left: x + 'px', top: y + 'px', color: `rgb(${r},${g},${b})`,
            fontSize: textSize + 'px', fontFamily: 'Arial', fontWeight: 'bold', zIndex: '100',
            pointerEvents: 'none', textShadow: '2px 2px 4px black'
        });
        document.body.appendChild(this.element);
    }
    setText(newLabel) { this.element.innerHTML = newLabel; }
    hide() { this.element.style.display = 'none'; }
}