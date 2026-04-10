class UIManager {
    public void draw(ArrayList<EditorObject> entities, EditorObject selected, File[] assets, String sceneName, float rotX, float rotY) {
        drawPanels();
        drawCreationButtons();
        drawHierarchy(entities, selected);
        drawInspector(selected);
        drawAssetBrowser(assets, selected);
        drawSceneGenerator(sceneName);
    }
    
    private void drawPanels() {
        fill(30);
        noStroke();
        rect(0, 0, 250, height - 200);
        
        fill(35);
        rect(width - 250, 0, 250, height - 200);
        
        fill(15);
        rect(0, height - 200, width, 200);
    }
    
    private void drawCreationButtons() {
        drawButton(260, 15, 90, 30, "+ CUBE");
        drawButton(360, 15, 90, 30, "+ SPHERE");
        drawButton(460, 15, 90, 30, "+ PLANE");
        drawButton(560, 15, 90, 30, "+ MODEL");
    }
    
    private void drawButton(float x, float y, float w, float h, String label) {
        boolean isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
        
        fill(isHover ? 100 : 60);
        noStroke();
        rect(x, y, w, h, 4);
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(11);
        text(label, x + w/2, y + h/2);
        textAlign(LEFT, BASELINE);
    }
    
    private void drawHierarchy(ArrayList<EditorObject> entities, EditorObject selected) {
        fill(255);
        textSize(14);
        text("HIERARCHY", 20, 30);
        textSize(11);
        text("Total: " + entities.size(), 20, 50);
        
        for (int i = 0; i < entities.size(); i++) {
            EditorObject obj = entities.get(i);
            boolean isHover = mouseX > 10 && mouseX < 240 && mouseY > 70 + i * 26 && mouseY < 94 + i * 26;
            color bgColor = (obj == selected) ? color(0, 100, 255) : (isHover ? color(80) : color(50));
            
            fill(bgColor);
            noStroke();
            rect(10, 70 + i * 26, 230, 24, 4);
            
            fill(255);
            textAlign(LEFT, CENTER);
            textSize(11);
            
            String icon = obj.hasTexture() ? "📷 " : "";
            text(icon + obj.getId(), 25, 82 + i * 26);
        }
    }
    
    private void drawInspector(EditorObject selected) {
        if (selected == null) {
            fill(150);
            textSize(12);
            text("Select an object", width - 180, height/2);
            text("to edit properties", width - 180, height/2 + 20);
            return;
        }
        
        fill(0, 255, 200);
        textSize(13);
        text("INSPECTOR", width - 240, 30);
        textSize(11);
        
        fill(255);
        text("ID: " + selected.getId(), width - 240, 60);
        text("Type: " + selected.getType(), width - 240, 80);
        text("Script: " + selected.getScript(), width - 240, 100);
        
        if (selected.getType().equals("MODEL")) {
            text("Model: " + (selected.getModelPath().isEmpty() ? "none" : selected.getModelPath()), width - 240, 120);
        }
        text("Texture: " + (selected.getTexturePath().isEmpty() ? "none" : selected.getTexturePath()), width - 240, 140);
        
        text("Position:", width - 240, 170);
        text(String.format("X: %.1f  Y: %.1f  Z: %.1f", selected.getPosition().x, selected.getPosition().y, selected.getPosition().z), width - 240, 190);
        
        text("Scale:", width - 240, 220);
        text(String.format("X: %.2f  Y: %.2f  Z: %.2f", selected.getScale().x, selected.getScale().y, selected.getScale().z), width - 240, 240);
        
        drawButton(width - 240, 260, 110, 30, "EDIT SCRIPT");
        drawButton(width - 130, 260, 110, 30, "LOAD MODEL");
        drawButton(width - 240, 295, 110, 30, "ADD TEXTURE");
        drawButton(width - 130, 295, 110, 30, "REMOVE TEX");
        drawButton(width - 240, 330, 230, 30, "DELETE OBJECT");
        
        fill(150, 150, 150);
        textSize(9);
        text("Click ADD TEXTURE to load PNG/JPG", width - 240, 375);
    }
    
    private void drawAssetBrowser(File[] assets, EditorObject selected) {
        String statusText = "DATA FOLDER - Click to apply to: " + (selected != null ? selected.getId() : "SELECT OBJECT");
        fill(100, 255, 200);
        textSize(11);
        text(statusText, 20, height - 175);
        
        if (assets == null) return;
        
        int displayCount = min(assets.length, 8);
        for (int i = 0; i < displayCount; i++) {
            float x = 20 + i * 110;
            String fileName = assets[i].getName();
            
            color iconColor = getFileColor(fileName);
            String fileType = getFileType(fileName);
            
            boolean isHover = mouseX > x && mouseX < x + 100 && mouseY > height - 150 && mouseY < height - 50;
            if (isHover) {
                stroke(0, 255, 200);
                strokeWeight(2);
            } else {
                noStroke();
            }
            
            fill(40);
            rect(x, height - 150, 100, 100, 5);
            
            drawFileIcon(fileName, iconColor, x);
            
            fill(255);
            textSize(8);
            textAlign(CENTER);
            text(fileType, x + 50, height - 135);
            
            textSize(9);
            String displayName = fileName.length() > 14 ? fileName.substring(0, 12) + ".." : fileName;
            text(displayName, x + 50, height - 30);
        }
        textAlign(LEFT, BASELINE);
        noStroke();
    }
    
    private color getFileColor(String fileName) {
        if (fileName.endsWith(".pde")) return color(0, 120, 255);
        if (fileName.endsWith(".obj")) return color(255, 150, 0);
        if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return color(200, 100, 255);
        return color(100);
    }
    
    private String getFileType(String fileName) {
        if (fileName.endsWith(".pde")) return "SCRIPT";
        if (fileName.endsWith(".obj")) return "MODEL";
        if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "TEXTURE";
        return "FILE";
    }
    
    private void drawFileIcon(String fileName, color iconColor, float x) {
        fill(iconColor);
        if (fileName.endsWith(".pde")) {
            rect(x + 40, height - 130, 20, 30);
        } else if (fileName.endsWith(".obj")) {
            ellipse(x + 50, height - 110, 30, 30);
        } else if (fileName.endsWith(".png") || fileName.endsWith(".jpg")) {
            rect(x + 35, height - 125, 30, 30);
            fill(255);
            textSize(8);
            text("TEX", x + 50, height - 105);
        } else {
            rect(x + 40, height - 120, 20, 20);
        }
    }
    
    private void drawSceneGenerator(String sceneName) {
        fill(255);
        textSize(11);
        text("Scene Name:", width - 240, height - 100);
        fill(50);
        rect(width - 240, height - 90, 230, 30);
        fill(255);
        text(sceneName, width - 230, height - 70);
        drawButton(width - 240, height - 50, 230, 40, "GENERATE SCENE CODE");
    }
    
    public String handleMousePress(int mouseX, int mouseY, int width, int height, EditorObject selected) {
        if (mouseY >= 15 && mouseY <= 45) {
            if (mouseX >= 260 && mouseX <= 350) return "CREATE_CUBE";
            if (mouseX >= 360 && mouseX <= 450) return "CREATE_SPHERE";
            if (mouseX >= 460 && mouseX <= 550) return "CREATE_PLANE";
            if (mouseX >= 560 && mouseX <= 650) return "CREATE_MODEL";
        }
        
        if (selected != null) {
            if (mouseX >= width - 240 && mouseX <= width - 130 && mouseY >= 260 && mouseY <= 290) return "EDIT_SCRIPT";
            if (mouseX >= width - 130 && mouseX <= width - 20 && mouseY >= 260 && mouseY <= 290) return "LOAD_MODEL";
            if (mouseX >= width - 240 && mouseX <= width - 130 && mouseY >= 295 && mouseY <= 325) return "ADD_TEXTURE";
            if (mouseX >= width - 130 && mouseX <= width - 20 && mouseY >= 295 && mouseY <= 325) return "REMOVE_TEXTURE";
            if (mouseX >= width - 240 && mouseX <= width - 10 && mouseY >= 330 && mouseY <= 360) return "DELETE_OBJECT";
        }
        
        if (mouseX >= width - 240 && mouseX <= width - 10 && mouseY >= height - 50 && mouseY <= height - 10) {
            return "GENERATE_SCENE";
        }
        
        return null;
    }
    
    public EditorObject handleHierarchySelection(int mouseX, int mouseY, int width, int height, ArrayList<EditorObject> entities) {
        if (mouseX < 250 && mouseY < height - 200 && mouseY > 70) {
            int idx = (mouseY - 70) / 26;
            if (idx >= 0 && idx < entities.size()) {
                return entities.get(idx);
            }
        }
        return null;
    }
    
    public void showHelp() {
        String help = "VertexEngine Controls:\n\n" +
                "1. SELECT object in Hierarchy (left panel)\n" +
                "2. Click ADD TEXTURE button (right panel)\n" +
                "3. Choose PNG or JPG file from data folder\n" +
                "4. Texture will appear on object!\n\n" +
                "CREATE BUTTONS - Click + CUBE, + SPHERE, etc.\n" +
                "W/S - Move Y (up/down)\n" +
                "Arrows - Move X/Z\n" +
                "Q/E - Scale up/down\n" +
                "R - Reset position and scale\n" +
                "BACKSPACE - Delete selected\n" +
                "Right mouse - Rotate view";
        JOptionPane.showMessageDialog(null, help, "Help", JOptionPane.INFORMATION_MESSAGE);
    }
}
