var Germ; var Cell; var Util; var Protein;
Util = require('./util.js');
Cell = require('./cell.js');
Protein = require('./protein.js');
objects = require('./objects.js');

Germ = function (index, x, y, dna) {
  this.index = index;
  this.age = 0;
  this.name = 'germ';
  if (!dna) {
    this.dna = {
      moveSpeed: 1.75,
      initRadius: 6,
      mitosisRadius: 11,
      proteinAttraction: 0,
      plasmaAttraction: 7,
      proteinYield: 7,
    };
  } else {
    this.dna = dna;
  }
  this.moveSpeed = 4;
  this.active = false;
  this.color = '#bb0000';
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

Util.inherits(Germ, Cell);

Germ.prototype.seekPlasma = function () {
  var target;
  target = this.findNearest('plasma');
  if (target) {
    this.goTo(target.pos);
  }
};

Germ.prototype.seekProtein = function () {
  var target;
  target = this.findNearest('protein');
  if (target) {
    if (this.dna.proteinAttraction > 0) {
      this.goTo(target.pos);
    } else {
      this.goTo(target.pos, true);
    }
  }
};

Germ.prototype.act = function () {
  var aa;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.color = this.active ? '#ee3333' : '#bb0000';
  if (this.radius > this.dna.mitosisRadius && window.cooldown < 0) {
    this.replicate();
  }
  if (Math.floor(Math.random()*210) < this.dna.plasmaAttraction) { this.seekPlasma(); }
  if (Math.floor(Math.random()*210) < Math.abs(this.dna.proteinAttraction)) { this.seekPlasma(); }
  this.age += 1;
  if (this.age > 1800) {
    this.radius -= 0.002;
  }
  if (this.radius < this.dna.initRadius/2) {
    this.destroy();
  }
  this.checkCollisions();
  if (this.radius > this.dna.mitosisRadius) { this.radius = this.dna.mitosisRadius; }
};

Germ.prototype.eatPlasma = function (plasma) {
  this.goTo({x: plasma.pos.x-32+Math.random()*64, y: plasma.pos.y-32+Math.random()*64});
  this.radius += 0.02;
};

Germ.prototype.checkCollisions = function () {
  var ee;
  for (ee=0; ee < objects.length; ee++) {
    if (objects[ee] && objects[ee].pos && objects[ee].radius && Util.distanceBetween(objects[ee].pos, this.pos) < this.radius+objects[ee].radius) {
      if (objects[ee].name === 'leuko') {
        this.radius -= 0.02;
        objects[ee].eatGerm(this);
      } else if (objects[ee].name === 'parasite') {
        this.radius -= 0.004;
        objects[ee].eatGerm(this);
      }
    }
  }
};

Germ.prototype.replicate = function () {
  var dnaCopy; var mutationFactor;
  mutationFactor = Math.random()*5;
  if (mutationFactor < 2.5) { mutationFactor = 0; }
  dnaCopy = {
    moveSpeed: this.dna.moveSpeed + (Math.random()-0.5)*mutationFactor,
    initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
    mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
    proteinAttraction: this.dna.proteinAttraction + (Math.random()-0.5)*mutationFactor,
    plasmaAttraction: this.dna.plasmaAttraction + (Math.random()-0.5)*mutationFactor,
    proteinYield: this.dna.proteinYield + (Math.random()-0.5)*mutationFactor,
  };
  if (dnaCopy.initRadius < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.moveSpeed < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.mitosisRadius < 2) { dnaCopy.initRadius = 3; }
  if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
  this.radius = this.dna.initRadius;
  objects.push(new Germ(objects.length, this.pos.x, this.pos.y, dnaCopy));
  for (aa=0; aa < this.dna.proteinYield; aa++) {
    objects.push(new Protein(objects.length, this.pos.x-16+Math.random()*32, this.pos.y-16+Math.random()*32));
  }
  window.cooldown = 32;
};

module.exports = Germ;
