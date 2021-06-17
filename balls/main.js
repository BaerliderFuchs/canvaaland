let settings = {
  amount: 100,
  speed: 2,
};
// an array to add multiple cells
let cells = [];
let flakes = [];

// this class describes the properties of a single cell.
class Cell {
  // setting the co-ordinates, radius and the
  // speed of a cell in both the co-ordinates axes.
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = 10;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
  }

  // creation of a cell.
  createCell() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  // setting the cell in motion.
  moveCell() {
    let direction = angleToDir(this.angle);

    if (this.x < 0 || this.x > width) direction.x *= -1;
    if (this.y < 0 || this.y > height) direction.y *= -1;

    this.x += direction.x * settings.speed;
    this.y += direction.y * settings.speed;
    this.angle = dirToAngle(direction.x, direction.y);
  }

  findFlake() {
    flakes.forEach((flake, i) => {
      let dis = dist(this.x, this.y, flake.x, flake.y);
      if (dis < 85) {
        this.angle = Math.atan2(flake.y - this.y, flake.x - this.x);
        // eat flake
        if (dis < this.size) {
          flakes.splice(i, 1);
          this.size += 5;
          //this.angle = Math.floor(Math.random() * 360) * (Math.PI / 180);
        }
      }
    });
  }

  findPrey() {
    cells.forEach((cell, i) => {
      if (cell == this) return;
      let dis = dist(this.x, this.y, cell.x, cell.y);
      if (dis <= 100) {
        if (this.size > cell.size) {
          this.angle = Math.atan2(cell.y - this.y, cell.x - this.x);
          stroke("rgba(255,255,255,0.4)");
          line(this.x, this.y, cell.x, cell.y);

          if (dis <= this.size / 2 - cell.size) {
            this.size += cell.size;
            cells.splice(i, 1);
            return;
          }
        }
        if (this.size < cell.size) {
          this.angle = Math.atan2(cell.y - this.y, cell.x - this.x) - degToRad(180);
        }
      }
    });
  }
}

class Flake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  createFlake() {
    noStroke();
    fill("red");
    circle(this.x, this.y, 5);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // create gui
  let gui = new dat.GUI();
  gui.add(settings, "amount", 1, 1000);
  gui.add(settings, "speed", 1, 10);

  for (let i = 0; i < settings.amount; i++) {
    cells.push(new Cell());
  }
}

function draw() {
  background("rgba(0,0,0,0.1)");
  cells.forEach((cell, i) => {
    cell.createCell();
    cell.findFlake();
    cell.findPrey();
    cell.moveCell();
  });
  flakes.forEach((flake, i) => {
    flake.createFlake();
  });
}

function mouseClicked() {
  flakes.push(new Flake(mouseX, mouseY));
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
