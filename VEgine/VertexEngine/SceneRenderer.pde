class SceneRenderer {
    public void render(ArrayList<EditorObject> entities, EditorObject selected, float rotX, float rotY) {
        translate(width / 2 + 100, height / 2 - 50, 0);
        
        rotateX(rotX);
        rotateY(rotY);
        
        drawGrid();
        drawAxes();
        
        for (EditorObject obj : entities) {
            obj.display(obj == selected);
        }
    }
    
    private void drawGrid() {
        stroke(60);
        strokeWeight(1);
        for (int i = -15; i <= 15; i++) {
            line(i * 50, 0, -750, i * 50, 0, 750);
            line(-750, 0, i * 50, 750, 0, i * 50);
        }
    }
    
    private void drawAxes() {
        strokeWeight(2);
        stroke(255, 0, 0);
        line(0, 0, 0, 100, 0, 0);
        stroke(0, 255, 0);
        line(0, 0, 0, 0, 100, 0);
        stroke(0, 0, 255);
        line(0, 0, 0, 0, 0, 100);
    }
}
