
// --- Steam Sketch ---
const steamSketch = (p) => {
    let particles = [];
    let canvas;

    p.setup = () => {
        const container = document.getElementById('home');
        if (!container) return;

        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('home');
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '1');
        canvas.style('pointer-events', 'none');
        p.clear();
    };

    p.draw = () => {
        p.clear();

        // Optimize: Only update and draw particles if the hero is in view
        if (window.scrollY < window.innerHeight) {
            if (p.frameCount % 2 === 0) {
                particles.push(new SteamParticle(p));
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].show();
                if (particles[i].finished()) {
                    particles.splice(i, 1);
                }
            }
        } else {
            particles = []; // Clear particles if out of view
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    class SteamParticle {
        constructor(p) {
            this.p = p;
            this.x = p.width / 2 + p.random(-50, 50);
            this.y = p.height - 100;
            this.vx = p.random(-0.5, 0.5);
            this.vy = p.random(-1.5, -0.5);
            this.alpha = 150;
            this.size = p.random(20, 50);
        }

        finished() {
            return this.alpha < 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 1;
            this.size += 0.2;

            // Mouse interaction
            let d = this.p.dist(this.p.mouseX, this.p.mouseY, this.x, this.y);
            if (d < 100) {
                this.vx += (this.x - this.p.mouseX) * 0.01;
            }
        }

        show() {
            this.p.noStroke();
            this.p.fill(255, 255, 255, this.alpha);
            this.p.ellipse(this.x, this.y, this.size);
        }
    }
};

// --- Background Particles Sketch ---
const bgParticlesSketch = (p) => {
    let particles = [];
    let canvas;

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        canvas.style('pointer-events', 'none');

        for (let i = 0; i < 50; i++) {
            particles.push(new BgParticle(p));
        }
    };

    p.draw = () => {
        p.clear(); // Keep it transparent so the main page background shows through

        particles.forEach(part => {
            part.update();
            part.show();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    class BgParticle {
        constructor(p) {
            this.p = p;
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.size = p.random(2, 5);
            this.vx = p.random(-0.2, 0.2);
            this.vy = p.random(-0.2, 0.2);
            this.alpha = p.random(20, 80);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = this.p.width;
            if (this.x > this.p.width) this.x = 0;
            if (this.y < 0) this.y = this.p.height;
            if (this.y > this.p.height) this.y = 0;
        }

        show() {
            this.p.noStroke();
            this.p.fill(210, 180, 140, this.alpha); // Tan/Coffee color
            this.p.ellipse(this.x, this.y, this.size);
        }
    }
};

// Initialize sketches based on presence of elements
if (document.getElementById('home')) {
    new p5(steamSketch);
}
new p5(bgParticlesSketch);
