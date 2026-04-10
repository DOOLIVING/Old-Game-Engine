Camera sceneCamera;
class Camera {
  float x = 70.0, y = 35.0, z = 120.0;
  float yaw = -HALF_PI; 
  float pitch = 0;      

  void apply() {
    float lookX = x + cos(yaw) * cos(pitch);
    float lookY = y + sin(pitch);
    float lookZ = z + sin(yaw) * cos(pitch);

    camera(x, y, z, lookX, lookY, lookZ, 0, 1, 0);
  }
}
