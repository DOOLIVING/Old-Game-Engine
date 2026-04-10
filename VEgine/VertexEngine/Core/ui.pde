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

  private void pres() {
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

  private void display() {
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

public class texts {
  float x, y;
  int r, g, b;
  String label;
  int textSize;

  texts(float x, float y, int r, int g, int b, String label, int textSize) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.label = label;
    this.textSize = textSize;
  }

  texts(float x, float y, String label, int textSize) {
    this.x = x;
    this.y = y;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.label = label;
    this.textSize = textSize;
  }
  
  private void display() {
    pushStyle();
    fill(r, g, b);
    textAlign(CENTER, CENTER);
    textSize(textSize);
    text(label, x, y);
    popStyle();
  }

  private void setText(String newLabel) {
    this.label = newLabel;
  }

  private void setColor(int r, int g, int b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}
