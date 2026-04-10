public class ParticleSystem {
    public ArrayList<Particle> particles;
    public PVector origin;
    public boolean isActive;

    private int maxParticles;
    private float spawnRate;
    private color startColor;
    private color endColor;
    private float startSize;
    private float endSize;
    
    public ParticleSystem(PVector position) {
        this.particles = new ArrayList<Particle>();
        this.origin = position.copy();
        this.isActive = true;
        this.maxParticles = 500; 
        this.spawnRate = 2;
        this.startColor = color(255, 200, 0);
        this.endColor = color(50, 50, 50, 0);
        this.startSize = 5;
        this.endSize = 1;
    }

    public void update() {
        if (!isActive) return;

        for (int i = 0; i < spawnRate; i++) {
            if (particles.size() < maxParticles) {
                particles.add(new Particle(origin, startColor, endColor, startSize, endSize));
            }
        }
 
        for (int i = particles.size() - 1; i >= 0; i--) {
            Particle p = particles.get(i);
            p.update();
            if (p.isDead()) {
                particles.remove(i);
            }
        }
    }

    public void display() {
        for (Particle p : particles) {
            p.display();
        }
    }
}

class Particle {
    PVector position;
    PVector velocity;
    PVector acceleration;
    float lifespan;
    float maxLifespan;
    color sCol, eCol;
    float sSize, eSize;

    Particle(PVector origin, color sc, color ec, float ss, float es) {
        position = origin.copy();
        velocity = new PVector(random(-0.5, 0.5), random(-1, -0.2), random(-0.5, 0.5));
        acceleration = new PVector(0, -0.01, 0);
        lifespan = 100.0;
        maxLifespan = 100.0;
        sCol = sc;
        eCol = ec;
        sSize = ss;
        eSize = es;
    }

    void update() {
        velocity.add(acceleration);
        position.add(velocity);
        lifespan -= 1.5; 
    }

    void display() {
        float pct = 1.0 - (lifespan / maxLifespan);
        color currentC = lerpColor(sCol, eCol, pct); 
        float currentSize = lerp(sSize, eSize, pct);

        pushMatrix();
        translate(position.x, position.y, position.z);
        noStroke();
        fill(currentC); 
        box(currentSize); 
        popMatrix();
    }

    boolean isDead() {
        return lifespan <= 0;
    }
}
