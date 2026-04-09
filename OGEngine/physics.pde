float gravityForce = 0.2;
float friction = 0.95;
float floorY = 400.0;    

boolean checkCollision(cube a, cube b) {
  float r1 = a.size / 2.0;
  float r2 = b.size / 2.0;

  return (abs(a.x - b.x) < (r1 + r2)) &&
         (abs(a.y - b.y) < (r1 + r2)) &&
         (abs(a.z - b.z) < (r1 + r2));
}

boolean checkModelCubeCollision(model m, cube c) {
  float rCube = c.size / 2.0;
  
  return (abs(m.x - c.x) < (m.sizeX/2.0 + rCube)) &&
         (abs(m.y - c.y) < (m.sizeY/2.0 + rCube)) &&
         (abs(m.z - c.z) < (m.sizeZ/2.0 + rCube));
}

class PhysicsBody {
  PVector velocity = new PVector(0, 0, 0);
  boolean onGround = false;
  float bounciness = 0.2; 

  PhysicsBody() {}

  void applyGravity() {
    if (!onGround) {
      velocity.y += gravityForce;
    }
  }

  void applyFriction() {
    velocity.x *= friction;
    velocity.z *= friction;

    if (abs(velocity.x) < 0.01) velocity.x = 0;
    if (abs(velocity.z) < 0.01) velocity.z = 0;
  }

  void addForce(float fx, float fy, float fz) {
    velocity.x += fx;
    velocity.y += fy;
    velocity.z += fz;
    onGround = false;
  }
}
