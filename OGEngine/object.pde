ArrayList<cube> worldCubes = new ArrayList<cube>();
ArrayList<ellipse> worldEllipse = new ArrayList<ellipse>();
ArrayList<sphere> worldSphere = new ArrayList<sphere>();
ArrayList<rect> worldRect = new ArrayList<rect>();

public class cube {
  float x, y, z;
  int r, g, b;
  float size;
  boolean physics = false;  
  
  cube(float x, float y, float z, float size, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = false;
  }

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
  
  private void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    box(size);
    popMatrix();
  }
  
  public void setPhysics(boolean physics) {
    this.physics = physics;
  }
  
  public boolean getPhysics() {
    return physics;
  }
}

public class ellipse {
  float x, y, z;
  int r, g, b;
  float sizex;
  float sizey;
  float sizeEllipse;
  boolean physics = false;
  
  ellipse(float x, float y, float z, float sizex, float sizey, float sizeEllipse, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizex = sizex;
    this.sizey = sizey;
    this.sizeEllipse = sizeEllipse;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = false;
  }

  ellipse(float x, float y, float z, float sizex, float sizey, float sizeEllipse, int r, int g, int b, boolean physics) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizex = sizex;
    this.sizey = sizey;
    this.sizeEllipse = sizeEllipse;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = physics;
  }
  
  private void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    ellipse(sizex, sizey, sizeEllipse, sizeEllipse);
    popMatrix();
  }
  
  public void setPhysics(boolean physics) {
    this.physics = physics;
  }
  
  public boolean getPhysics() {
    return physics;
  }
}

public class sphere {
  float x, y, z;
  int r, g, b;
  float radius;
  boolean physics = false;

  sphere(float x, float y, float z, float radius, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = false;
  }

  sphere(float x, float y, float z, float radius, int r, int g, int b, boolean physics) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = physics;
  }
  
  public void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    sphere(radius);
    popMatrix();
  }
  
  public void setPhysics(boolean physics) {
    this.physics = physics;
  }
  
  public boolean getPhysics() {
    return physics;
  }
}

public class rect {
  float x, y, z;
  int r, g, b;
  int sizeX, sizeY;
  boolean physics = false;

  rect(int x, int y, int z, int sizeX, int sizeY) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.physics = false;
  }

  rect(int x, int y, int z, int sizeX, int sizeY, boolean physics) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.physics = physics;
  }

  rect(float x, float y, float z, int sizeX, int sizeY, int Posx, int Posy, int r, int g, int b) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = false;
  }

  rect(float x, float y, float z, int sizeX, int sizeY, int Posx, int Posy, int r, int g, int b, boolean physics) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.r = r;
    this.g = g;
    this.b = b;
    this.physics = physics;
  }
  
  private void display() {
    pushMatrix();
    fill(r, g, b);
    translate(x, y, z);
    rect(0, 0, sizeX, sizeY);
    popMatrix();
  }
  
  public void setPhysics(boolean physics) {
    this.physics = physics;
  }
  
  public boolean getPhysics() {
    return physics;
  }
}
