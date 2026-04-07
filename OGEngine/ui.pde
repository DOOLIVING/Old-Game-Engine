public class button {
  float x, y;
  float sizeX, sizeY;
  int r, g, b;
  String label; 
  boolean isPressed = false;      
  boolean clickedTrigger = false; 

  button(float x, float y, float sizeX, float sizeY, int r, int g, int b, String label) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.r = r;
    this.g = g;
    this.b = b;
    this.label = label;
  }

  void pres() {
    clickedTrigger = false; 
    
    if (mousePressed) {
      if (mouseX > x && mouseX < x + sizeX && mouseY > y && mouseY < y + sizeY) {
        if (!isPressed) {
          isPressed = true;
          clickedTrigger = true; 
          println("pressed: " + label);
        }
      }
    } else {
      isPressed = false;
    }
  }

  void display() {
    if (isPressed) {
      fill(r - 50, g - 50, b - 50);
    } else {
      fill(r, g, b);
    }
    
    rect(x, y, sizeX, sizeY);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(label, x + sizeX/2, y + sizeY/2);
  }

  boolean isClicked() {
    return clickedTrigger;
  }
}
