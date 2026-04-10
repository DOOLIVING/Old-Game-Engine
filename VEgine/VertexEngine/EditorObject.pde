class EditorObject {
    private String id;
    private String type;
    private PVector position;
    private PVector scale;
    private String scriptPath;
    private String modelPath;
    private String texturePath;
    private PShape modelPreview;
    private PImage texture;
    
    public EditorObject(String type, int index) {
        this.type = type;
        this.id = type + "_" + index;
        this.position = new PVector(0, 0, 0);
        this.scale = new PVector(1, 1, 1);
        this.scriptPath = "none";
        this.modelPath = "";
        this.texturePath = "";
        this.modelPreview = null;
        this.texture = null;
    }
    
    public String getId() { return id; }
    public String getType() { return type; }
    public PVector getPosition() { return position; }
    public PVector getScale() { return scale; }
    public String getScript() { return scriptPath; }
    public String getModelPath() { return modelPath; }
    public String getTexturePath() { return texturePath; }
    public boolean hasScript() { return !scriptPath.equals("none"); }
    public boolean hasTexture() { return texture != null; }
    public boolean hasModel() { return modelPreview != null; }
    
    public void setScript(String script) { this.scriptPath = script; }
    public void setType(String type) { this.type = type; }
    
    public void removeTexture() {
        this.texture = null;
        this.texturePath = "";
    }
    
    public void loadModel(File file) {
        this.modelPath = file.getName();
        try {
            this.modelPreview = loadShape(file.getAbsolutePath());
            this.type = "MODEL";
        } catch (Exception e) {
            println("Error loading model: " + e.getMessage());
        }
    }
    
    public void loadTexture(File file) {
        this.texturePath = file.getName();
        try {
            this.texture = loadImage(file.getAbsolutePath());
        } catch (Exception e) {
            println("Error loading texture: " + e.getMessage());
        }
    }
    
    public void handleKeyPress(char key, int keyCode, float moveSpeed) {
        if (keyCode == UP) position.z -= moveSpeed;
        if (keyCode == DOWN) position.z += moveSpeed;
        if (keyCode == LEFT) position.x -= moveSpeed;
        if (keyCode == RIGHT) position.x += moveSpeed;
        if (key == 'w') position.y -= moveSpeed;
        if (key == 's') position.y += moveSpeed;
        
        if (key == 'q') {
            scale.x = constrain(scale.x + 0.1f, 0.1f, 5.0f);
            scale.y = constrain(scale.y + 0.1f, 0.1f, 5.0f);
            scale.z = constrain(scale.z + 0.1f, 0.1f, 5.0f);
        }
        if (key == 'e') {
            scale.x = constrain(scale.x - 0.1f, 0.1f, 5.0f);
            scale.y = constrain(scale.y - 0.1f, 0.1f, 5.0f);
            scale.z = constrain(scale.z - 0.1f, 0.1f, 5.0f);
        }
        
        if (key == 'r') {
            position = new PVector(0, 0, 0);
            scale = new PVector(1, 1, 1);
        }
    }
    
    public void display(boolean isSelected) {
        pushMatrix();
        translate(position.x, position.y, position.z);
        scale(scale.x, scale.y, scale.z);
        
        if (isSelected) {
            drawSelectionOutline();
        }
        
        noStroke();
        drawObject();
        popMatrix();
    }
    
    private void drawSelectionOutline() {
        stroke(0, 255, 255);
        strokeWeight(2);
        noFill();
        
        if (type.equals("SPHERE")) {
            sphere(32);
        } else if (type.equals("PLANE")) {
            box(105, 2, 105);
        } else {
            box(55);
        }
    }
    
    private void drawObject() {
        if (type.equals("MODEL") && modelPreview != null) {
            if (texture != null) {
                modelPreview.setTexture(texture);
            }
            shape(modelPreview);
        } else if (type.equals("SPHERE")) {
            if (texture != null) {
                drawSphereWithTexture(30);
            } else {
                fill(200, 100, 255);
                sphereDetail(16);
                sphere(30);
            }
        } else if (type.equals("PLANE")) {
            if (texture != null) {
                drawPlaneWithTexture(50);
            } else {
                fill(100);
                box(100, 1, 100);
            }
        } else {
            if (texture != null) {
                drawCubeWithTexture(50);
            } else {
                fill(180);
                box(50);
            }
        }
    }
    
    private void drawSphereWithTexture(float radius) {
        float detail = 30;
        textureMode(NORMAL);
        beginShape(TRIANGLES);
        texture(texture);
        
        for (int i = 0; i < detail; i++) {
            float lat1 = map(i, 0, detail, -PI/2, PI/2);
            float lat2 = map(i+1, 0, detail, -PI/2, PI/2);
            
            for (int j = 0; j < detail; j++) {
                float lon1 = map(j, 0, detail, -PI, PI);
                float lon2 = map(j+1, 0, detail, -PI, PI);
                
                float x1 = radius * cos(lat1) * cos(lon1);
                float y1 = radius * sin(lat1);
                float z1 = radius * cos(lat1) * sin(lon1);
                float u1 = map(j, 0, detail, 0, 1);
                float v1 = map(i, 0, detail, 0, 1);
                
                float x2 = radius * cos(lat2) * cos(lon1);
                float y2 = radius * sin(lat2);
                float z2 = radius * cos(lat2) * sin(lon1);
                float u2 = map(j, 0, detail, 0, 1);
                float v2 = map(i+1, 0, detail, 0, 1);
                
                float x3 = radius * cos(lat2) * cos(lon2);
                float y3 = radius * sin(lat2);
                float z3 = radius * cos(lat2) * sin(lon2);
                float u3 = map(j+1, 0, detail, 0, 1);
                float v3 = map(i+1, 0, detail, 0, 1);
                
                vertex(x1, y1, z1, u1, v1);
                vertex(x2, y2, z2, u2, v2);
                vertex(x3, y3, z3, u3, v3);
                
                x2 = radius * cos(lat2) * cos(lon2);
                y2 = radius * sin(lat2);
                z2 = radius * cos(lat2) * sin(lon2);
                u2 = map(j+1, 0, detail, 0, 1);
                v2 = map(i+1, 0, detail, 0, 1);
                
                x3 = radius * cos(lat1) * cos(lon2);
                y3 = radius * sin(lat1);
                z3 = radius * cos(lat1) * sin(lon2);
                u3 = map(j+1, 0, detail, 0, 1);
                v3 = map(i, 0, detail, 0, 1);
                
                vertex(x1, y1, z1, u1, v1);
                vertex(x2, y2, z2, u2, v2);
                vertex(x3, y3, z3, u3, v3);
            }
        }
        endShape();
    }
    
    private void drawCubeWithTexture(float size) {
        float half = size / 2;
        textureMode(NORMAL);
        
        beginShape(QUADS);
        texture(texture);
        vertex(-half, -half, half, 0, 1);
        vertex(half, -half, half, 1, 1);
        vertex(half, half, half, 1, 0);
        vertex(-half, half, half, 0, 0);
        endShape();
        
        beginShape(QUADS);
        texture(texture);
        vertex(half, -half, -half, 0, 1);
        vertex(-half, -half, -half, 1, 1);
        vertex(-half, half, -half, 1, 0);
        vertex(half, half, -half, 0, 0);
        endShape();
        
        beginShape(QUADS);
        texture(texture);
        vertex(-half, -half, -half, 0, 1);
        vertex(half, -half, -half, 1, 1);
        vertex(half, -half, half, 1, 0);
        vertex(-half, -half, half, 0, 0);
        endShape();
        
        beginShape(QUADS);
        texture(texture);
        vertex(-half, half, half, 0, 1);
        vertex(half, half, half, 1, 1);
        vertex(half, half, -half, 1, 0);
        vertex(-half, half, -half, 0, 0);
        endShape();
        
        beginShape(QUADS);
        texture(texture);
        vertex(half, -half, half, 0, 1);
        vertex(half, -half, -half, 1, 1);
        vertex(half, half, -half, 1, 0);
        vertex(half, half, half, 0, 0);
        endShape();
        
        beginShape(QUADS);
        texture(texture);
        vertex(-half, -half, -half, 0, 1);
        vertex(-half, -half, half, 1, 1);
        vertex(-half, half, half, 1, 0);
        vertex(-half, half, -half, 0, 0);
        endShape();
    }
    
    private void drawPlaneWithTexture(float size) {
        fill(255);
        beginShape();
        texture(texture);
        textureMode(NORMAL);
        vertex(-size, -1, -size, 0, 0);
        vertex(size, -1, -size, 1, 0);
        vertex(size, -1, size, 1, 1);
        vertex(-size, -1, size, 0, 1);
        endShape(CLOSE);
    }
}
