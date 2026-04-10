class SceneExporter {
    public void export(ArrayList<EditorObject> entities, String sceneName) {
        ArrayList<String> code = new ArrayList<String>();
        code.add("class " + sceneName + " extends Scene {");
        code.add("  " + sceneName + "() {");
        code.add("    bgColor = 50;");
        code.add("    ");
        
        for (EditorObject obj : entities) {
            exportObject(obj, code);
        }
        
        code.add("  }");
        code.add("");
        code.add("  @Override");
        code.add("  void update() {");
        code.add("    super.update();");
        code.add("    movement();");
        code.add("  }");
        code.add("}");
        
        saveStrings("data/" + sceneName + ".pde", code.toArray(new String[0]));
        JOptionPane.showMessageDialog(null, "Scene code saved to data/" + sceneName + ".pde!");
    }
    
    private void exportObject(EditorObject obj, ArrayList<String> code) {
        code.add("\n    // Entity: " + obj.getId());
        
        String type = obj.getType();
        PVector pos = obj.getPosition();
        PVector scale = obj.getScale();
        
        if (type.equals("CUBE")) {
            code.add(String.format("    worldCubes.add(new cube(%.1f, %.1f, %.1f, %.1f, 255, 255, 255, false));",
                    pos.x, pos.y, pos.z, 50 * scale.x));
        } else if (type.equals("SPHERE")) {
            code.add(String.format("    worldModels.add(new model(%.1f, %.1f, %.1f, %.1f, \"sphere.obj\"));",
                    pos.x, pos.y, pos.z, 30 * scale.x));
        } else if (type.equals("MODEL") && !obj.getModelPath().isEmpty()) {
            code.add(String.format("    worldModels.add(new model(%.1f, %.1f, %.1f, %.1f, \"data/%s\"));",
                    pos.x, pos.y, pos.z, 50 * scale.x, obj.getModelPath()));
        }
        
        if (obj.hasScript()) {
            code.add("    // Attached script: " + obj.getScript());
        }
        if (obj.hasTexture()) {
            code.add("    // Texture applied: " + obj.getTexturePath());
        }
    }
}
