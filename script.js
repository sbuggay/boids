let flock = [];
let quadtree;
let fps = 0;


function setup() {
    const width = Math.min(800, windowWidth);
    const canvas = createCanvas(width, width);
    canvas.parent("sketch");
    reset();
}

function reset() {
    window.debug = 0; // 0, 1, 2, 3
    window.pause = false;
    flock = [];
    for (let i = 0; i < 300; i++) {
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

    for (let i = 0; i < flock.length; i++) {
        let boid = flock[i];
        let range = new Rect(boid.position.x, boid.position.y, boid.perception, boid.perception);
        let localFlock = quadtree.query(range);

        if (!window.pause)
            boid.update(localFlock);

        boid.render();

        if (window.debug === 1 && i === 0) {
            stroke(0, 0, 255);
            fill(0, 0, 0, 0);
            rectMode(CENTER);
            rect(range.x, range.y, range.w * 2, range.h * 2);
        }
    }

    if (window.debug === 1) {
        quadtree.render();
    }

    setInterval(() => {
        fps = frameRate();
    }, 100);

    fill(fps >= 60 ? "green" : "red");
    stroke(0);
    text(fps.toFixed(2), 10, 20);
}

debugButton.onclick = () => {
    window.debug = (window.debug + 1) % 2;
}

function keyReleased() {
    if (key === "d") {
        window.debug = (window.debug + 1) % 3;
    }
    else if (key === "r") {
        reset();
    }
    else if (key === "p") {
        window.pause = !window.pause;
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