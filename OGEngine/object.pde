ArrayList<cube> worldCubes = new ArrayList<cube>();
ArrayList<ellipse> worldEllipse = new ArrayList<ellipse>();
ArrayList<sphere> worldSphere = new ArrayList<sphere>();
ArrayList<rect> worldRect = new ArrayList<rect>();
ArrayList<model> worldModels = new ArrayList<model>();

public class cube {
  float x, y, z;
  int r, g, b;
  float size;
  boolean physics = false;  
  PImage tex = null; 
  PhysicsBody pb = new PhysicsBody();

  cube(float x, float y, float z, float size, int r, int g, int b, boolean physics) {
    this.x = x; this.y = y; this.z = z;
    this.size = size;
    this.r = r; this.g = g; this.b = b;
    this.physics = physics;
  }

  cube(float x, float y, float z, float size, int r, int g, int b, boolean physics, PImage tex) {
    this(x, y, z, size, r, g, b, physics);
    this.tex = tex;
  }

  public void updatePhysics() {
    if (physics) {
      pb.applyGravity();
      pb.applyFriction();
      if (y + size/2 > floorY) {
        y = floorY - size/2;
        pb.velocity.y *= -pb.bounciness;
        if (abs(pb.velocity.y) < 0.5) pb.velocity.y = 0;
        pb.onGround = true;
      } else { pb.onGround = false; }
      x += pb.velocity.x; y += pb.velocity.y; z += pb.velocity.z;
    }
  }
  
  public void display() {
    pushMatrix();
    translate(x, y, z);
    if (tex != null) {
      noStroke();
      float s = size / 2;
      beginShape(QUADS);
      texture(tex);
      textureMode(IMAGE);
      normal(0,0,1); vertex(-s,-s,s,0,0); vertex(s,-s,s,tex.width,0); vertex(s,s,s,tex.width,tex.height); vertex(-s,s,s,0,tex.height);
      normal(0,0,-1); vertex(-s,-s,-s,0,0); vertex(s,-s,-s,tex.width,0); vertex(s,s,-s,tex.width,tex.height); vertex(-s,s,-s,0,tex.height);
      normal(0,-1,0); vertex(-s,-s,-s,0,0); vertex(s,-s,-s,tex.width,0); vertex(s,-s,s,tex.width,tex.height); vertex(-s,-s,s,0,tex.height);
      normal(0,1,0); vertex(-s,s,-s,0,0); vertex(s,s,-s,tex.width,0); vertex(s,s,s,tex.width,tex.height); vertex(-s,s,s,0,tex.height);
      normal(-1,0,0); vertex(-s,-s,-s,0,0); vertex(-s,-s,s,tex.width,0); vertex(-s,s,s,tex.width,tex.height); vertex(-s,s,-s,0,tex.height);
      normal(1,0,0); vertex(s,-s,-s,0,0); vertex(s,-s,s,tex.width,0); vertex(s,s,s,tex.width,tex.height); vertex(s,s,-s,0,tex.height);
      endShape();
    } else {
      fill(r, g, b);
      box(size);
    }
    popMatrix();
  }
}

public class sphere {
  float x, y, z, radius;
  int r, g, b;
  PImage tex = null;
  boolean physics = false;
  PhysicsBody pb = new PhysicsBody();

  sphere(float x, float y, float z, float radius, int r, int g, int b, boolean physics) {
    this.x = x; this.y = y; this.z = z;
    this.radius = radius;
    this.r = r; this.g = g; this.b = b;
    this.physics = physics;
  }
  
  sphere(float x, float y, float z, float radius, int r, int g, int b) {
    this(x, y, z, radius, r, g, b, false);
  }

  public void updatePhysics() {
    if (physics) {
      pb.applyGravity();
      if (y + radius > floorY) { y = floorY - radius; pb.velocity.y = 0; pb.onGround = true; } 
      else { pb.onGround = false; }
      y += pb.velocity.y;
    }
  }

  public void display() {
    pushMatrix();
    translate(x, y, z);
    noStroke();
    if (tex != null) {
      fill(255);
      beginShape(SPHERE);
      texture(tex);
      sphere(radius);
      endShape();
    } else {
      fill(r, g, b);
      sphere(radius);
    }
    popMatrix();
  }
}

public class model {
  float x, y, z, scaleSize;
  PShape shape;
  String fileName;
  boolean physics = false;
  float velY = 0;
  float rotX = 0, rotY = 0, rotZ = 0;

  public float sizeX, sizeY, sizeZ;

  model(float x, float y, float z, float scaleSize, String fileName, boolean physics) {
    this.x = x; this.y = y; this.z = z;
    this.scaleSize = scaleSize;
    this.fileName = fileName;
    this.physics = physics;
    this.shape = loadShape(fileName);

    this.sizeX = 50 * scaleSize;
    this.sizeY = 50 * scaleSize;
    this.sizeZ = 50 * scaleSize;
  }
  
  model(float x, float y, float z, float scaleSize, String fileName) {
    this(x, y, z, scaleSize, fileName, false);
  }

  public void update() {
    if (physics) {
      velY += 0.2; 
      y += velY;
      if (y > floorY) { y = floorY; velY = 0; }
    }
  }

  public void display() {
    if (shape != null) {
      update();
      pushMatrix();
      translate(x, y, z);
      rotateX(rotX); rotateY(rotY); rotateZ(rotZ);
      scale(scaleSize);
      resetShader(); fill(255); stroke(0);
      shape(shape);
      popMatrix();
    }
  }
}

public class ellipse {
  float x, y, z;
  public float sizeX, sizeY;
  int r, g, b;
  boolean physics = false;
  float velY = 0;

  ellipse(float x, float y, float z, float sizeX, float sizeY, int r, int g, int b, boolean physics) {
    this.x = x; this.y = y; this.z = z;
    this.sizeX = sizeX; this.sizeY = sizeY;
    this.r = r; this.g = g; this.b = b;
    this.physics = physics;
  }
  
  ellipse(float x, float y, float z, float sizeX, float sizeY, int r, int g, int b) {
    this(x, y, z, sizeX, sizeY, r, g, b, false);
  }

  public void display() {
    if (physics) { velY += 0.2; y += velY; if (y > floorY) { y = floorY; velY = 0; } }
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    ellipse(0, 0, sizeX, sizeY);
    popMatrix();
  }
}

public class rect {
  float x, y, z;
  public int sizeX, sizeY;
  int r, g, b;
  boolean physics = false;
  float velY = 0;

  rect(float x, float y, float z, int sizeX, int sizeY, int r, int g, int b, boolean physics) {
    this.x = x; this.y = y; this.z = z;
    this.sizeX = sizeX; this.sizeY = sizeY;
    this.r = r; this.g = g; this.b = b;
    this.physics = physics;
  }

  rect(float x, float y, float z, int sizeX, int sizeY, int r, int g, int b) {
    this(x, y, z, sizeX, sizeY, r, g, b, false);
  }

  public void display() {
    if (physics) { velY += 0.2; y += velY; if (y > floorY) { y = floorY; velY = 0; } }
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    rect(0, 0, sizeX, sizeY);
    popMatrix();
  }
}
