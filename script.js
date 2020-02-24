const flock = [];
let quadtree;
window.debug = 0; // 0, 1, 2, 3

function setup() {
    const min = Math.min(windowWidth, windowHeight)
    const canvas = createCanvas(min, min);
    canvas.parent("sketch");

    for (let i = 0; i < 300; i++) {
        const boid = new Boid()
        flock.push(boid);
    }

}

function draw() {
    background(51);

    quadtree = new QuadTree(new Rect(width / 2, height / 2, width / 2, height / 2), 1);

    for (let boid of flock) {
        quadtree.insert(boid);
    }

    for (let boid of flock) {
        let range = new Rect(boid.position.x, boid.position.y, boid.perception, boid.perception);
        let localFlock = quadtree.query(range);
        boid.update(localFlock);
        boid.render();
    }

    if (window.debug === 1) {
        quadtree.render();
    }
}

function keyReleased() {
    if (key === "d") {
        window.debug = (window.debug + 1) % 2;
    }
    return false; // prevent any default behavior
}

function mousePressed() {
    window.mouse = {
        x: mouseX,
        y: mouseY
    }
}

function mouseDragged() {
    window.mouse = {
        x: mouseX,
        y: mouseY
    }
}

function mouseReleased() {
    window.mouse = null;
}