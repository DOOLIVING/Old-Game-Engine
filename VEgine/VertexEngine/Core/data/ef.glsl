// data/effect.glsl
#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

varying vec4 vertColor;
varying vec4 vertTexCoord;
uniform sampler2D texture;

void main() {
  vec4 col = texture2D(texture, vertTexCoord.st) * vertColor;
  // Инверсия цвета для проверки
  gl_FragColor = vec4(1.0 - col.rgb, col.a);
}