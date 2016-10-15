var Protein; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
objects = require('./objects.js');

Protein = function (index, x, y, dna) {
  this.index = index;
  this.name = 'protein';
  this.age = 0;
  this.moveSpeed = 1;
  this.active = false;
  this.color = '#00bb00';
  if (!dna) {
    this.dna = {
      initRadius: 5-(Math.random()*2),
      mitosisRadius: 6,
      ageCapCent: 18,
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

Util.inherits(Protein, Cell);

Protein.prototype.act = function () {
  this.age += 1;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.checkCollisions();
  this.radius += 0.002;
  if (this.radius > this.dna.mitosisRadius && window.cooldown < 0) {
    this.replicate();
  }
  if (this.age > this.dna.ageCapCent*100) {
    this.radius -= 0.01;
  }
  if (this.radius < 1) {
    this.destroy();
  }
};

Protein.prototype.checkCollisions = function () {
  var jj;
  for (jj=0; jj < objects.length; jj++) {
    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
      if (objects[jj].name === 'plasma') {
        this.radius -= 0.02;
        objects[jj].eatProtein();
      }
    }
  }
};

Protein.prototype.replicate = function () {
  this.pos.x += (Math.random()*32-16);
  this.pos.y += (Math.random()*32-16);
  var dnaCopy; var mutationFactor;
  mutationFactor = Math.random()*2;
  if (mutationFactor < 1) { mutationFactor = 0; }
  dnaCopy = {
    initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
    mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
    ageCapCent: this.dna.ageCapCent + (Math.random()-0.5)*mutationFactor,
  };
  if (dnaCopy.initRadius < 0) { dnaCopy.initRadius = 1; }
  if (dnaCopy.mitosisRadius < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
  objects.push(new Protein(objects.length, this.pos.x+(Math.random()*32-16), this.pos.y+(Math.random()*32-16), dnaCopy));
  objects.push(new Protein(objects.length, this.pos.x+(Math.random()*32-16), this.pos.y+(Math.random()*32-16), dnaCopy));
  window.cooldown = 32;
  this.radius = this.dna.initRadius;
  this.age /= 2;
};

module.exports = Protein;
