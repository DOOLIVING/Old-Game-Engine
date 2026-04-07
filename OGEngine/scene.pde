class Scene {
  ArrayList<button> worldButton = new ArrayList<button>();
  ArrayList<cube> worldCubes = new ArrayList<cube>();
  ArrayList<sphere> worldSphere = new ArrayList<sphere>();
  ArrayList<light> worldLight = new ArrayList<light>();
  
  int bgColor = 255;

  Scene() {}

  void update() {

    for (button b : worldButton) {

    }
  }

  void display() {
    background(bgColor);

    pushMatrix();
    sceneCamera.apply(); 
    
    int lCount = 0;
    for (light lg : worldLight) {
      if (lCount < 8) {
        pointLight(lg.r, lg.g, lg.b, lg.x, lg.y, lg.z);
        lCount++;
      }
      lg.display();
    }
    
    for (cube c : worldCubes) c.display();
    for (sphere s : worldSphere) s.display();
    popMatrix();

    hint(DISABLE_DEPTH_TEST);
    pushStyle();
    noLights();
    camera(); 
    
    for (button b : worldButton) {
      b.display();
    }
    
    popStyle();
    hint(ENABLE_DEPTH_TEST);
  }
}
