public class Scene {
  ArrayList<button> worldButton = new ArrayList<button>();
  ArrayList<cube> worldCubes = new ArrayList<cube>();
  ArrayList<sphere> worldSphere = new ArrayList<sphere>();
  ArrayList<light> worldLight = new ArrayList<light>();
  ArrayList<sound> worldSound = new ArrayList<sound>();
  ArrayList<texts> worldTexts = new ArrayList<texts>();
  ArrayList<model> worldModels = new ArrayList<model>();
  ArrayList<ParticleSystem> worldParticles = new ArrayList<ParticleSystem>();
  
  int bgColor = 255;
  PShader sceneShader; 

  Scene() {}

  void setShader(String path) {
    this.sceneShader = loadShader(path);
  }

  void update() {
    for (int i = worldParticles.size() - 1; i >= 0; i--) {
      worldParticles.get(i).update();
    }

    for (cube c : worldCubes) {
      if (c.physics) {
        c.updatePhysics();

        for (cube other : worldCubes) {
          if (c != other && checkCollision(c, other)) {
            c.y -= c.pb.velocity.y;
            c.pb.velocity.y *= -0.2; 
          }
        }
      }
    }

    for (model m : worldModels) {
      if (m.physics) {
        m.update();
      }
    }

    for (button b : worldButton) {
    }
  }

  void display() {
    background(bgColor);

    if (sceneShader != null) {
      shader(sceneShader);
    }

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
 
    for (ParticleSystem ps : worldParticles) {
      ps.display();
    }

    for (model m : worldModels) {
      m.display();
    }
    
    popMatrix();

    resetShader(); 

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
