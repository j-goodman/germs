var Protein; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
objects = require('./objects.js');

Protein = function (index, x, y) {
  this.index = index;
  this.name = 'protein';
  this.moveSpeed = 1;
  this.active = false;
  this.color = '#00bb00';
  this.radius = 4;
  this.speed = {
    x: 0,
    y: 0,
  };
  this.pos = {
    x: x,
    y: y,
  };
};

Util.inherits(Protein, Cell);

Protein.prototype.act = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.checkCollisions();
};

Protein.prototype.checkCollisions = function () {
  var jj;
  for (jj=0; jj < objects.length; jj++) {
    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
      if (objects[jj].name === 'plasma') {
        this.radius -= 0.02;
        if (this.radius < 2) {
          objects[jj].eatProtein();
          this.destroy();
        }
      }
    }
  }
};


module.exports = Protein;
