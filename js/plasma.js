var Plasma; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
objects = require('./objects.js');

Plasma = function (index, x, y) {
  this.index = index;
  this.name = 'plasma';
  this.moveSpeed = 3;
  this.active = false;
  this.color = '#0000bb';
  this.radius = 10;
  this.speed = {
    x: 0,
    y: 0,
  };
  this.pos = {
    x: x,
    y: y,
  };
};

Util.inherits(Plasma, Cell);

Plasma.prototype.act = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  if (!Math.floor(Math.random()*60)) {
    this.seekProtein();
  }
  this.checkCollisions();
};

Plasma.prototype.seekProtein = function () {
  var target;
  target = this.findNearest('protein');
  if (target) {
    this.goTo(target.pos);
  }
};

Plasma.prototype.eatProtein = function () {
  this.radius += 2;
  if (this.radius > 19) {
    objects.push(new Plasma(objects.length, this.pos.x, this.pos.y));
    this.radius = 10;
  }
};

Plasma.prototype.checkCollisions = function () {
  var jj;
  for (jj=0; jj < objects.length; jj++) {
    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
      if (objects[jj].name === 'germ') {
        if (this.radius < 4) {
          this.destroy();
        } else {
          this.radius -= 0.04;
          objects[jj].eatPlasma(this);
        }
      }
    }
  }
};


module.exports = Plasma;
