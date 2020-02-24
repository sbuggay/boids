const flock = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 100; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(51);

    for (let boid of flock) {
        boid.update(flock);
        boid.render();
    }
}