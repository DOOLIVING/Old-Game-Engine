class AssetManager {
    public File[] refreshAssets() {
        File dataDir = new File(sketchPath("data"));
        if (!dataDir.exists()) {
            dataDir.mkdir();
        }
        return dataDir.listFiles();
    }
    
    public void handleAssetClick(int mouseX, int mouseY, int width, int height, EditorObject selected) {
        if (mouseY <= height - 150 || mouseY >= height - 50) return;
        
        File[] assets = refreshAssets();
        if (assets == null) return;
        
        int idx = (int) ((mouseX - 20) / 110);
        if (idx < 0 || idx >= assets.length) return;
        
        String fileName = assets[idx].getName();
        
        if (fileName.endsWith(".pde")) {
            selected.setScript(fileName);
            JOptionPane.showMessageDialog(null, "Script assigned: " + fileName);
        } else if (fileName.endsWith(".obj")) {
            selected.loadModel(assets[idx]);
            JOptionPane.showMessageDialog(null, "Model loaded: " + fileName);
        } else if (isTextureFile(fileName)) {
            selected.loadTexture(assets[idx]);
            JOptionPane.showMessageDialog(null, "Texture loaded: " + fileName);
        }
    }
    
    private boolean isTextureFile(String fileName) {
        return fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg");
    }
}
