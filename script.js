const flock = [];
let qt;

function setup() {  
    createCanvas(800, 800);


    for (let i = 0; i < 200; i++) {
        const boid = new Boid()
        flock.push(boid);

    }

    
}

function draw() {
    background(51);

    qt = new QuadTree(new Rect(width / 2, height / 2, width / 2, height / 2), 2);


    for (let boid of flock) {
        boid.update(flock);
        qt.insert(boid.position);
        boid.render();
    }

    qt.render();
}