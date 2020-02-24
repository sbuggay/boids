const flock = [];
let quadtree;
window.debug = 0; // 0, 1, 2, 3

function setup() {
    const min = Math.min(windowWidth, windowHeight)
    const canvas = createCanvas(min, min);
    canvas.parent("sketch");

    for (let i = 0; i < 500; i++) {
        const boid = new Boid()
        flock.push(boid);
    }

}

function draw() {
    background(51);

    quadtree = new QuadTree(new Rect(width / 2, height / 2, width / 2, height / 2), 4);


    for (let boid of flock) {

        quadtree.insert(boid);

        let range = new Rect(boid.position.x, boid.position.y, boid.perception, boid.perception);
        
        if (window.debug === 3) {
            push();
            stroke(0, 200, 0, 100);
            fill(0, 0, 0, 0);
            rectMode(CENTER);
            translate(range.x, range.y);
            rect(0, 0, range.w * 2, range.h * 2)
            pop();
        }
        
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
        window.debug = (window.debug + 1) % 3;
    }
    return false; // prevent any default behavior
  }