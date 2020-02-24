class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w &&
            point.x < this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y < this.y + this.h);
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.list = [];
        this.divided = false;
    }

    insert(point) {

        if (!this.boundary.contains(point)) return;

        if (this.list.length < this.capacity) {
            this.list.push(point);
        }
        else {
            if (!this.divided) {
                this.subdivide();
            }

            this.ne.insert(point);
            this.nw.insert(point);
            this.sw.insert(point);
            this.se.insert(point);
        }
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let neRect = new Rect(x + w / 2, y + h / 2, w / 2, h / 2);
        let nwRect = new Rect(x - w / 2, y + h / 2, w / 2, h / 2);
        let swRect = new Rect(x - w / 2, y - h / 2, w / 2, h / 2);
        let seRect = new Rect(x + w / 2, y - h / 2, w / 2, h / 2);
        this.ne = new QuadTree(neRect, this.capacity);
        this.nw = new QuadTree(nwRect, this.capacity);
        this.sw = new QuadTree(swRect, this.capacity);
        this.se = new QuadTree(seRect, this.capacity);
        this.divided = true;

    }

    render() {

        if (this.ne) this.ne.render();
        if (this.nw) this.nw.render();
        if (this.se) this.se.render();
        if (this.sw) this.sw.render();

        push();
        stroke(200);
        fill(0, 0, 0, 0);
        rectMode(CENTER);
        translate(this.boundary.x, this.boundary.y);
        rect(0, 0, this.boundary.w * 2, this.boundary.h * 2)
        pop();


    }
}

