class MenuScene extends Scene {
  boolean musicStarted = false;

  MenuScene() {
    bgColor = 200;
    worldButton.add(new button(width/2 - 75, height/2, 150, 40, 100, 100, 100, "ИГРАТЬ"));
  }

  @Override
  void update() {
    super.update();



    // Проверяем кнопку
    if (worldButton.size() > 0 && worldButton.get(0).isClicked()) {
      println("Кнопка нажата, переход в GameLevel");
      currentScene = new GameLevel();
    }
  }
}

// ============================================================

class GameLevel extends Scene {
  GameLevel() {
    bgColor = 50;
    worldCubes.add(new cube(0, 0, 0, 50, 255, 0, 0, true));
    
    // Останавливаем музыку меню (если хочешь)
    if (worldSound.size() > 0) {
      worldSound.get(0).stop();
    }
  }

  @Override
  void update() {
    super.update();
    movement();  // исправлено название (было movment)
  }
}

// ============================================================

public void movement() {
  if (keyPressed == true) {
    float rotateSpeed = 0.03;
    
    // Движение
    if (key == 'a' || key == 'ф') sceneCamera.x -= 2.0;
    if (key == 'd') sceneCamera.x += 2.0;
    if (key == 'w') sceneCamera.z -= 2.0;
    if (key == 's') sceneCamera.z += 2.0;
    if (key == 'q') sceneCamera.y -= 2.0;
    if (key == 'e') sceneCamera.y += 2.0;
    
    // Поворот
    if (keyCode == LEFT)  sceneCamera.yaw -= rotateSpeed;
    if (keyCode == RIGHT) sceneCamera.yaw += rotateSpeed;
    if (keyCode == UP)    sceneCamera.pitch -= rotateSpeed;
    if (keyCode == DOWN)  sceneCamera.pitch += rotateSpeed;
  }
}
