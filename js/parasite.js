var Parasite; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
Protein = require('./protein.js');
objects = require('./objects.js');

Parasite = function (index, x, y, dna) {
  this.index = index;
  this.name = 'parasite';
  this.age = 0;
  this.active = false;
  this.color = '#440022';
  this.alpha = 1;
  if (!dna) {
    this.dna = {
      moveSpeed: 6,
      initRadius: 1,
      mitosisRadius: 2,
      leukoAttraction: 10,
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

Util.inherits(Parasite, Cell);

Parasite.prototype.act = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  if (Math.floor(Math.random()*100) < this.dna.leukoAttraction) {
    if (this.count('leuko') > 2) {
      this.seekLeuko();
    } else {
      this.seekGerm();
    }
  }
  this.age += 1;
  if (this.age > 1800) {
    this.radius -= 0.005;
  }
  if (this.radius < this.dna.initRadius/4) {
    this.destroy();
  }
  if (this.radius > this.dna.mitosisRadius && !Math.floor(Math.random()*1000)) {
    this.replicate();
  }
};

Parasite.prototype.seekGerm = function () {
  var target;
  target = this.findNearest('germ');
  if (target) {
    this.goTo(target.pos);
  }
};

Parasite.prototype.seekLeuko = function () {
  var target;
  target = this.findNearest('leuko');
  if (target) {
    this.goTo(target.pos);
  }
};

Parasite.prototype.eatLeuko = function (leuko) {
  this.radius += 0.004*leuko.radius/6;
  this.goTo({x: leuko.pos.x-16+Math.random()*32, y: leuko.pos.y-16+Math.random()*32});
  if (this.radius > this.dna.mitosisRadius+0.2) { this.radius = this.dna.mitosisRadius; }
};

Parasite.prototype.eatGerm = function (germ) {
  this.radius += 0.004;
  this.goTo({x: germ.pos.x-16+Math.random()*32, y: germ.pos.y-16+Math.random()*32});
  if (this.radius > this.dna.mitosisRadius+0.2) { this.radius = this.dna.mitosisRadius; }
};

Parasite.prototype.count = function (name) {
  var cc; var count;
  count = 0;
  for (cc=0; cc < objects.length; cc++) {
    if (objects[cc] && objects[cc].name === name) {
      count++;
    }
  }
  return count;
};

Parasite.prototype.replicate = function () {
  var dnaCopy; var mutationFactor; var aa;
  mutationFactor = Math.random()*5;
  if (mutationFactor < 2.5) { mutationFactor = 0; }
  dnaCopy = {
    moveSpeed: this.dna.moveSpeed + (Math.random()-0.5)*mutationFactor,
    initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
    mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
    leukoAttraction: this.dna.germAttraction + (Math.random()-0.5)*mutationFactor,
  };
  if (dnaCopy.initRadius < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.moveSpeed < 1) { dnaCopy.initRadius = 2; }
  if (dnaCopy.mitosisRadius < 2) { dnaCopy.initRadius = 3; }
  if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
  objects.push(new Parasite(objects.length, this.pos.x, this.pos.y, dnaCopy));
  this.radius = this.dna.initRadius;
  window.cooldown = 32;
};

module.exports = Parasite;
