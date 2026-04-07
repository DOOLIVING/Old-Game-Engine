// Сцена меню — наследуется от базового класса Scene
class MenuScene extends Scene {
  MenuScene() {
    bgColor = 200;  // Серый фон
    
    // Создаём кнопку "ИГРАТЬ" по центру экрана
    worldButton.add(new button(width/2-75, height/2, 150, 40, 100, 100, 100, "ИГРАТЬ"));
    
    // Загружаем фоновую музыку и запускаем её по кругу
    worldSound.add(new sound("2.mp3", 0.5));
    worldSound.get(worldSound.size() - 1).loop();
  }

  @Override
  void update() {
    super.update();  // Вызываем update() родительского класса (пока пустой)
    
    // Если кнопка "ИГРАТЬ" нажата — переключаемся на игровой уровень
    if (worldButton.size() > 0 && worldButton.get(0).isClicked()) {
      currentScene = new GameLevel(); 
    }
  }
}

// Игровой уровень
class GameLevel extends Scene {
  GameLevel() {
    bgColor = 50;  // Тёмно-серый фон
    
    // Добавляем красный куб с физикой (пока только флаг, сама физика не реализована)
    worldCubes.add(new cube(0, 0, 0, 50, 255, 0, 0, true));
  }

  @Override
  void update() {
    super.update();
    movment();  // Обрабатываем движение камеры с клавиатуры
  }
}

// Управление камерой (движение + повороты)
public void movment() {
  if(keyPressed == true) {
    float rotateSpeed = 0.03;  // Скорость поворота камеры
    
    // Движение WASD (с поддержкой русской раскладки для 'ф' = 'a')
    if(key == 'a' || key == 'ф') sceneCamera.x -= 2.0;  // Влево
    if(key == 'd') sceneCamera.x += 2.0;                 // Вправо
    if(key == 'w') sceneCamera.z -= 2.0;                 // Вперёд
    if(key == 's') sceneCamera.z += 2.0;                 // Назад
    if(key == 'q') sceneCamera.y -= 2.0;                 // Вниз
    if(key == 'e') sceneCamera.y += 2.0;                 // Вверх
    
    // Повороты камеры (стрелки)
    if(keyCode == LEFT)  sceneCamera.yaw   -= rotateSpeed;  // Влево
    if(keyCode == RIGHT) sceneCamera.yaw   += rotateSpeed;  // Вправо
    if(keyCode == UP)    sceneCamera.pitch -= rotateSpeed;  // Вверх
    if(keyCode == DOWN)  sceneCamera.pitch += rotateSpeed;  // Вниз
  }
}
