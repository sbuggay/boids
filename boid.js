class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.maxSpeed = 3;
        this.maxForce = 0.01;
        this.size = 15;
        this.perception = 30;
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
        }

        if (count > 0) {
            wish.div(count);
            wish.setMag(this.maxSpeed);
            wish.sub(this.velocity);
            wish.limit(this.maxForce);
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
        }

        if (count > 0) {
            wish.div(count);
            wish.setMag(this.maxSpeed);
            wish.sub(this.velocity);
            wish.limit(this.maxForce);
            this.affected = true;
        }
        return wish;
    }

    update(boids) {

        this.affected = false;
        this.acceleration.add(this.align(boids));
        this.acceleration.add(this.cohesion(boids));
        
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
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
        
        const h = Math.sqrt(this.size ** 2 - (this.size / 2) ** 2);
        triangle(h / 2, 0, h / -2, this.size / 3, h / -2, this.size / -3);
        stroke(this.affected ? color(0, 100, 0) : 100);
        circle(0, 0, this.perception * 2);
        pop();
    }
}