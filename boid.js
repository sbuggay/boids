const maxSpeed = 4;
const maxForce = 0.05;
const size = 15;
const maxPercieved = 30;

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.perception = 30;
        this.affected = false;
    }

    align(boids) {
        if (boids.length === 0) return;

        let wish = createVector();

        for (let boid of boids) {
            wish.add(boid.velocity);
        }

        wish.div(boids.length);
        wish.setMag(maxSpeed);
        wish.sub(this.velocity);
        wish.limit(maxForce);
        return wish;
    }

    cohesion(boids) {
        if (boids.length === 0) return;

        let wish = createVector();

        for (let boid of boids) {
            wish.add(boid.position);
        }

        wish.div(boids.length);
        wish.sub(this.position);
        wish.setMag(maxSpeed);
        wish.sub(this.velocity);
        wish.limit(maxForce);

        return wish;
    }

    separation(boids, d) {
        if (boids.length === 0) return;

        let wish = createVector();

        for (let boid of boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            // if (d < (this.perception / 2)) {
                let diff = p5.Vector.sub(this.position, boid.position);
                diff.div(d * d);
                wish.add(diff);
            // }
        }

        wish.div(boids.length);
        wish.setMag(maxSpeed * 1.1);
        wish.sub(this.velocity);
        wish.limit(maxForce);

        return wish;
    }

    update(boids) {

        let count = 0;

        let localBoids = [];

        for (let boid of boids) {
            if (boid === this) continue;
            let d = (this.position.x - boid.position.x) ** 2 + (this.position.y - boid.position.y) ** 2;
            if (d < (this.perception) ** 2) {
                localBoids.push(boid);

            }
            count++;
            if (count >= maxPercieved) break;
        }

        this.acceleration.add(this.align(localBoids));
        this.acceleration.add(this.cohesion(localBoids));
        this.acceleration.add(this.separation(localBoids));

        this.affected = localBoids.length > 0;

        if (window.mouse) {
            if (window.mouse.x <= width && window.mouse.x >= 0 && window.mouse.y <= height && window.mouse.y >= 0) {
                const wish = p5.Vector.sub(createVector(window.mouse.x, window.mouse.y), this.position);
                this.acceleration.add(wish);
            }
        }

        this.velocity.add(this.acceleration);
        this.velocity.limit(maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        if (this.position.x < 0 || this.position.x > width) {
            this.position.x = (this.position.x + width) % width;
        }
        if (this.position.y < 0 || this.position.y > height) {
            this.position.y = (this.position.y + height) % height;
        }
    }

    render() {
        push();
        translate(this.position.x, this.position.y)
        rotate(this.velocity.heading());
        fill(0, 0, 0, 0);
        strokeWeight(1);
        stroke(255);

        if (window.debug === 2) {
            stroke(this.affected ? color(0, 100, 0) : 100);
            circle(0, 0, this.perception * 2);
        }
        else {
            const h = Math.sqrt(size ** 2 - (size / 2) ** 2);
            triangle(h / 2, 0, h / -2, size / 3, h / -2, size / -3);
        }

        pop();
    }
}