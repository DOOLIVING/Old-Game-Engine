ArrayList<light> worldLight = new ArrayList<light>();

public class light {
  int r, g, b;
  float x, y, z;
  
  light(int r, int g, int b, float x, float y, float z) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  private void display() {
    pushMatrix();
    translate(x, y, z);
    fill(r, g, b);
    noStroke();
    sphere(5);  
    popMatrix();
  }

  private void apply() {
    pointLight(r, g, b, x, y, z);
  }
}
