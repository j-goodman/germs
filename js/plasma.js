var Plasma; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
objects = require('./objects.js');

Plasma = function (index, x, y, dna) {
  this.index = index;
  this.name = 'plasma';
  this.age = 0;
  this.active = false;
  this.color = '#0000bb';
  if (!dna) {
    this.dna = {
      moveSpeed: 1,
      initRadius: 8,
      mitosisRadius: 14,
    };
  } else {
    this.dna = dna;
  }
  this.radius = this.dna.initRadius;
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
  this.age += 1;
  if (this.age > 1800) {
    this.radius -= 0.01;
  }
  if (this.radius < this.dna.initRadius/2) {
    this.destroy();
  }
};

Plasma.prototype.seekProtein = function () {
  var target;
  target = this.findNearest('protein');
  if (target) {
    this.goTo(target.pos);
  }
};

Plasma.prototype.eatProtein = function () {
  this.radius += 0.02;
  if (this.radius > this.dna.mitosisRadius && window.cooldown < 0) {
    this.replicate();
  }
  if (this.radius > this.dna.mitosisRadius) { this.radius = this.dna.mitosisRadius; }
};

Plasma.prototype.checkCollisions = function () {
  var jj;
  for (jj=0; jj < objects.length; jj++) {
    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
      if (objects[jj].name === 'germ' || objects[jj].name === 'leuko') {
        this.radius -= 0.02;
        objects[jj].eatPlasma(this);
      }
    }
  }
};

Plasma.prototype.replicate = function () {
  var dnaCopy; var mutationFactor;
  mutationFactor = Math.random()*5;
  if (mutationFactor < 2.5) { mutationFactor = 0; }
  dnaCopy = {
    moveSpeed: this.dna.moveSpeed + (Math.random()-0.5)*mutationFactor,
    initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
    mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
  };
  if (dnaCopy.initRadius < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.moveSpeed < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.mitosisRadius < 2) { dnaCopy.initRadius = 3; }
  if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
  objects.push(new Plasma(objects.length, this.pos.x, this.pos.y, dnaCopy));
  objects.push(new Plasma(objects.length, this.pos.x, this.pos.y, dnaCopy));
  window.cooldown = 32;
  this.radius = this.dna.initRadius;
};

module.exports = Plasma;
