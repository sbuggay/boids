const maxSpeed = 4;
const maxForce = 0.05;
const size = 15;
const maxPercieved = 30;

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.perception = 50;
        this.affected = false;
    }

    align(boids) {
        let wish = createVector();

        let count = 0;

        for (let boid of boids) {
            if (boid === this) continue;

            if (dist(this.position.x, this.position.y, boid.position.x, boid.position.y) < this.perception) {
                wish.add(boid.velocity);
                count++;
            }

            if (count >= maxPercieved) break;
        }

        if (count > 0) {
            wish.div(count);
            wish.setMag(maxSpeed);
            wish.sub(this.velocity);
            wish.limit(maxForce);
            this.affected = true;
        }
        return wish;
    }

    cohesion(boids) {
        let wish = createVector();

        let count = 0;

        for (let boid of boids) {
            if (boid === this) continue;

            if (dist(this.position.x, this.position.y, boid.position.x, boid.position.y) < this.perception) {
                wish.add(boid.position);
                count++;
            }

            if (count >= maxPercieved) break;
        }

        if (count > 0) {
            wish.div(count);
            wish.sub(this.position);
            wish.setMag(maxSpeed);
            wish.sub(this.velocity);
            wish.limit(maxForce);
            this.affected = true;
        }
        return wish;
    }

    separation(boids) {
        let wish = createVector();
        let count = 0;
        for (let boid of boids) {
            if (boid === this) continue;
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (d < (this.perception / 2)) {
                let diff = p5.Vector.sub(this.position, boid.position);
                diff.div(d * d);
                wish.add(diff);
                count++;
            }

            if (count >= maxPercieved) break;
        }
        if (count > 0) {
            wish.div(count);
            wish.setMag(maxSpeed * 2);
            wish.sub(this.velocity);
            wish.limit(maxForce);
        }
        return wish;
    }

    update(boids) {

        this.affected = false;
        this.acceleration.add(this.align(boids));
        this.acceleration.add(this.cohesion(boids));
        this.acceleration.add(this.separation(boids));

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

        const h = Math.sqrt(size ** 2 - (size / 2) ** 2);
        triangle(h / 2, 0, h / -2, size / 3, h / -2, size / -3);

        if (window.debug === 2) {
            stroke(this.affected ? color(0, 100, 0) : 100);
            circle(0, 0, this.perception * 2);
        }

        pop();
    }
}