ArrayList<cube> worldCubes = new ArrayList<cube>();
ArrayList<ellipse> worldEllipse = new ArrayList<ellipse>();
ArrayList<sphere> worldSphere = new ArrayList<sphere>();
ArrayList<rect> worldRect = new ArrayList<rect>();

public class cube {
  float x, y, z;
  int r, g, b;
  float size;
  boolean physics = false;  
  PImage tex = null; 

  cube(float x, float y, float z, float size, int r, int g, int b, boolean physics) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = physics;
  }

  cube(float x, float y, float z, float size, int r, int g, int b, boolean physics, PImage tex) {
    this(x, y, z, size, r, g, b, physics);
    this.tex = tex;
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

      vertex(-s, -s, -s, 0, 0);
      vertex( s, -s, -s, tex.width, 0);
      vertex( s,  s, -s, tex.width, tex.height);
      vertex(-s,  s, -s, 0, tex.height);
      vertex(-s, -s,  s, 0, 0);
      vertex( s, -s,  s, tex.width, 0);
      vertex( s,  s,  s, tex.width, tex.height);
      vertex(-s,  s,  s, 0, tex.height);
      vertex(-s,  s, -s, 0, 0);
      vertex( s,  s, -s, tex.width, 0);
      vertex( s,  s,  s, tex.width, tex.height);
      vertex(-s,  s,  s, 0, tex.height);
      vertex(-s, -s, -s, 0, 0);
      vertex( s, -s, -s, tex.width, 0);
      vertex( s, -s,  s, tex.width, tex.height);
      vertex(-s, -s,  s, 0, tex.height);
      vertex(-s, -s, -s, 0, 0);
      vertex(-s, -s,  s, tex.width, 0);
      vertex(-s,  s,  s, tex.width, tex.height);
      vertex(-s,  s, -s, 0, tex.height);
      vertex( s, -s, -s, 0, 0);
      vertex( s, -s,  s, tex.width, 0);
      vertex( s,  s,  s, tex.width, tex.height);
      vertex( s,  s, -s, 0, tex.height);
      
      endShape();
    } else {
      fill(r, g, b);
      box(size);
    }
    popMatrix();
  }
  
  public void setPhysics(boolean physics) { this.physics = physics; }
  public boolean getPhysics() { return physics; }
}

public class sphere {
  float x, y, z;
  int r, g, b;
  float radius;
  PImage tex = null;

  sphere(float x, float y, float z, float radius, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  sphere(float x, float y, float z, float radius, int r, int g, int b, PImage tex) {
    this(x, y, z, radius, r, g, b);
    this.tex = tex;
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

public class ellipse {
  float x, y, z;
  int r, g, b;
  float sizeX, sizeY;
  
  ellipse(float x, float y, float z, float sizeX, float sizeY, int r, int g, int b) {
    this.x = x; this.y = y; this.z = z;
    this.sizeX = sizeX; this.sizeY = sizeY;
    this.r = r; this.g = g; this.b = b;
  }
  
  public void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    ellipse(0, 0, sizeX, sizeY);
    popMatrix();
  }
}

public class rect {
  float x, y, z;
  int r, g, b;
  int sizeX, sizeY;

  rect(float x, float y, float z, int sizeX, int sizeY, int r, int g, int b) {
    this.x = x; this.y = y; this.z = z;
    this.sizeX = sizeX; this.sizeY = sizeY;
    this.r = r; this.g = g; this.b = b;
  }

  public void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    rect(0, 0, sizeX, sizeY);
    popMatrix();
  }
}

public class model {
  float x, y, z;
  float scaleSize;
  PShape shape;
  String fileName;

  float rotX = 0;
  float rotY = 0;
  float rotZ = 0;

  model(float x, float y, float z, float scaleSize, String fileName) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scaleSize = scaleSize;
    this.fileName = fileName;
    
    this.shape = loadShape(fileName);
    
    if (this.shape == null) {
      println("!!! ОШИБКА: Файл " + fileName + " не найден в папке data !!!");
    } else {
      println("Модель " + fileName + " успешно загружена.");
    }
  }

  public void display() {
    if (shape != null) {
      pushMatrix();

      translate(x, y, z);

      rotateX(rotX);
      rotateY(rotY);
      rotateZ(rotZ);

      scale(scaleSize); 

      resetShader(); 
      fill(255); 
      stroke(0); 
      
      shape(shape);
      
      popMatrix();
    }
  }
}
