import java.io.File;
import java.util.ArrayList;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

private ArrayList<EditorObject> entities;
private EditorObject selected;
private File[] assets;
private float rotX = -0.5f;
private float rotY = 0.5f;
private String sceneName = "Level_1";
private boolean filePickerActive = false;
private UIManager uiManager;
private AssetManager assetManager;
private SceneRenderer sceneRenderer;
private SceneExporter sceneExporter;

public void setup() {
    size(1200, 800, P3D);
    surface.setTitle("VertexEngine");
    
    entities = new ArrayList<EditorObject>();
    assetManager = new AssetManager();
    uiManager = new UIManager();
    sceneRenderer = new SceneRenderer();
    sceneExporter = new SceneExporter();
    
    assetManager.refreshAssets();
    textFont(createFont("Arial", 12));
    frameRate(60);
    smooth();
    
    entities.add(new EditorObject("CUBE", 0));
    selected = entities.get(0);
}

public void draw() {
    background(20);
    if (frameCount % 120 == 0) {
        assets = assetManager.refreshAssets();
    }

    pushMatrix();
    sceneRenderer.render(entities, selected, rotX, rotY);
    popMatrix();

    hint(DISABLE_DEPTH_TEST);
    camera();
    uiManager.draw(entities, selected, assets, sceneName, rotX, rotY);
    hint(ENABLE_DEPTH_TEST);
}

public void mousePressed() {
    String action = uiManager.handleMousePress(mouseX, mouseY, width, height, selected);
    
    if (action != null) {
        if (action.equals("CREATE_CUBE")) {
            entities.add(new EditorObject("CUBE", entities.size()));
        } else if (action.equals("CREATE_SPHERE")) {
            entities.add(new EditorObject("SPHERE", entities.size()));
        } else if (action.equals("CREATE_PLANE")) {
            entities.add(new EditorObject("PLANE", entities.size()));
        } else if (action.equals("CREATE_MODEL")) {
            entities.add(new EditorObject("MODEL", entities.size()));
        } else if (action.equals("LOAD_MODEL") && selected != null && !filePickerActive) {
            filePickerActive = true;
            selectInput("Select OBJ file:", "modelSelected");
        } else if (action.equals("ADD_TEXTURE") && selected != null && !filePickerActive) {
            filePickerActive = true;
            selectInput("Select texture file (PNG, JPG, JPEG):", "textureSelected");
        } else if (action.equals("REMOVE_TEXTURE") && selected != null) {
            selected.removeTexture();
            JOptionPane.showMessageDialog(null, "Texture removed from " + selected.getId());
        } else if (action.equals("DELETE_OBJECT") && selected != null) {
            entities.remove(selected);
            selected = null;
        } else if (action.equals("GENERATE_SCENE")) {
            sceneExporter.export(entities, sceneName);
        } else if (action.equals("EDIT_SCRIPT") && selected != null) {
            if (selected.hasScript()) {
                openScriptEditor(selected.getScript());
            } else {
                JOptionPane.showMessageDialog(null, "No script assigned!");
            }
        }
    }
    
    EditorObject newSelected = uiManager.handleHierarchySelection(mouseX, mouseY, width, height, entities);
    if (newSelected != null) {
        selected = newSelected;
    }
    
    if (selected != null) {
        assetManager.handleAssetClick(mouseX, mouseY, width, height, selected);
    }
}

public void modelSelected(File selection) {
    filePickerActive = false;
    if (selection != null && selected != null) {
        selected.loadModel(selection);
        JOptionPane.showMessageDialog(null, "Model loaded: " + selection.getName());
    }
}

public void textureSelected(File selection) {
    filePickerActive = false;
    if (selection != null && selected != null) {
        selected.loadTexture(selection);
        JOptionPane.showMessageDialog(null, "Texture loaded: " + selection.getName());
    }
}

public void keyPressed() {
    if (selected != null) {
        float moveSpeed = (keyPressed && key == SHIFT) ? 1.0f : 10.0f;
        selected.handleKeyPress(key, keyCode, moveSpeed);
        
        if (key == BACKSPACE) {
            entities.remove(selected);
            selected = null;
        }
    }
    
    if (key == 'n') {
        String input = JOptionPane.showInputDialog("Enter Scene Name:");
        if (input != null && !input.trim().isEmpty()) {
            sceneName = input;
        }
    }
    
    if (key == 'h') {
        uiManager.showHelp();
    }
}

private void openScriptEditor(String fileName) {
    try {
        File scriptFile = new File(sketchPath("data/" + fileName));
        String[] lines = loadStrings(scriptFile.getAbsolutePath());
        
        JTextArea textArea = new JTextArea(lines != null ? join(lines, "\n") : "");
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        
        JScrollPane scrollPane = new JScrollPane(textArea);
        scrollPane.setPreferredSize(new Dimension(600, 500));
        
        JFrame frame = new JFrame("Script Editor: " + fileName);
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.add(scrollPane, BorderLayout.CENTER);
        
        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(e -> {
            saveStrings(scriptFile.getAbsolutePath(), textArea.getText().split("\n"));
            JOptionPane.showMessageDialog(frame, "Saved!");
        });
        frame.add(saveButton, BorderLayout.SOUTH);
        frame.pack();
        frame.setVisible(true);
    } catch (Exception e) {
        JOptionPane.showMessageDialog(null, "Error opening editor: " + e.getMessage());
    }
}

public void mouseDragged() {
    if (mouseButton == RIGHT) {
        rotY += (mouseX - pmouseX) * 0.01f;
        rotX += (mouseY - pmouseY) * 0.01f;
        rotX = constrain(rotX, -PI / 2, PI / 2);
    }
}
