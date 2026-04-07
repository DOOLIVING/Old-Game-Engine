import processing.sound.*;
PApplet app;
Scene currentScene;

public void setup() {
  size(1200, 650, P3D); 
  app = this;
  pixelDensity(1); 
  sceneCamera = new Camera();
  sphereDetail(18); 
  currentScene = new MenuScene();
}

public void draw() {
  background(255);

  keyboard();
  //script();
  setigsDefault();
  if (currentScene == null) return;

  for (button b : currentScene.worldButton) { 
    b.pres(); 
  }

  pushMatrix();
  sceneCamera.apply(); 

  int lightCount = 0;
  for (light lg : worldLight) {
    if (lightCount < 8) {
      pointLight(lg.r, lg.g, lg.b, lg.x, lg.y, lg.z); 
      lightCount++;
    }
    lg.display(); 
  }

  for (cube c : worldCubes) c.display();
  for (ellipse l : worldEllipse) l.display();
  for (sphere s : worldSphere) s.display();
  for (rect r : worldRect) r.display();
  
  popMatrix(); 

  hint(DISABLE_DEPTH_TEST); 
  
  pushStyle(); 
  noLights();
  camera();   
  
  for (button b : currentScene.worldButton) {
    b.display();
  }
  
  popStyle(); 
  hint(ENABLE_DEPTH_TEST); 
  
  currentScene.update();  
  currentScene.display();
}
