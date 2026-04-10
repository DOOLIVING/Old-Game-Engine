import processing.sound.*;
public class sound {
  String address;
  float volume;
  SoundFile soundFile;
  
  sound(String address, float volume) {
    this.address = address;
    this.volume = volume;
    this.soundFile = new SoundFile(app, address);
    this.soundFile.amp(volume);
  }
  
  private void play() {
    if (soundFile != null) {
      soundFile.play();
    }
  }
  
  private void loop() {
    if (soundFile != null) {
      soundFile.loop();
    }
  }
  
  private void stop() {
    if (soundFile != null) {
      soundFile.stop();
    }
  }
  
  private void pause() {
    if (soundFile != null) {
      soundFile.pause();
    }
  }
  
  private void setVolume(float volume) {
    this.volume = volume;
    if (soundFile != null) {
      soundFile.amp(volume);
    }
  }
}
