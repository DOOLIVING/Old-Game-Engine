#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    
    // Градиент, который следует за мышью
    float dist = distance(st, mouse);
    
    vec3 color1 = vec3(0.2, 0.4, 0.8);
    vec3 color2 = vec3(0.9, 0.3, 0.5);
    vec3 color3 = vec3(0.1, 0.8, 0.3);
    
    vec3 color = mix(color1, color2, st.x);
    color = mix(color, color3, st.y);
    
    // Добавляем свечение вокруг мыши
    float glow = 0.05 / dist;
    color += vec3(glow * 0.8, glow * 0.5, glow);
    
    gl_FragColor = vec4(color, 1.0);
}