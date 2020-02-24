let flock = [];
let quadtree;
window.debug = 0; // 0, 1, 2, 3

function setup() {
    
    const width = Math.min(800, windowWidth);

    const canvas = createCanvas(width, width);
    canvas.parent("sketch");

    reset();

}

function reset() {
    flock = [];
    for (let i = 0; i < 250; i++) {
        const boid = new Boid()
        flock.push(boid);
    }
}

function draw() {
    background(20);

    quadtree = new QuadTree(new Rect(width / 2, height / 2, width / 2, height / 2), 4);

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

debugButton.onclick = () => {
    window.debug = (window.debug + 1) % 2;
}

function keyReleased() {
    if (key === "d") {
        window.debug = (window.debug + 1) % 2;
    }
    else if (key === "r") {
        reset();
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