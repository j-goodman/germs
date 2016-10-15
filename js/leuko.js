var Leuko; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
Protein = require('./protein.js');
objects = require('./objects.js');

Leuko = function (index, x, y, dna) {
  this.index = index;
  this.name = 'leuko';
  this.age = 0;
  this.active = false;
  this.color = '#bbccdd';
  this.alpha = 1;
  if (!dna) {
    this.dna = {
      moveSpeed: 1.25,
      initRadius: 5,
      mitosisRadius: 8,
      germAttraction: 6,
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

Util.inherits(Leuko, Cell);

Leuko.prototype.act = function () {
  if (this.radius > 20) {
    this.alpha = 0.8;
  } else if (this.radius > 40) {
    this.alpha = 0.6;
  } else if (this.radius > 50) {
    this.alpha = 0.4;
  }
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  if (Math.floor(Math.random()*100) < this.dna.germAttraction) {
    if (this.count('germ') > 1) {
      this.seekGerm();
    } else {
      this.seekPlasma();
    }
  }
  this.age += 1;
  if (this.age > 1800) {
    this.radius -= 0.002;
  }
  if (this.radius < this.dna.initRadius/2) {
    this.destroy();
  }
  if (this.radius > this.dna.mitosisRadius && window.cooldown < 0) {
    this.replicate();
  }
};

Leuko.prototype.seekGerm = function () {
  var target;
  target = this.findNearest('germ');
  if (target) {
    this.goTo(target.pos);
  }
};

Leuko.prototype.seekPlasma = function () {
  var target;
  target = this.findNearest('plasma');
  if (target) {
    this.goTo(target.pos);
  }
};

Leuko.prototype.eatGerm = function (germ) {
  this.radius += 0.015;
  this.goTo({x: germ.pos.x-16+Math.random()*32, y: germ.pos.y-16+Math.random()*32});
  if (this.radius > this.dna.mitosisRadius) { this.radius = this.dna.mitosisRadius; }
};

Leuko.prototype.count = function (name) {
  var cc; var count;
  count = 0;
  for (cc=0; cc < objects.length; cc++) {
    if (objects[cc] && objects[cc].name === name) {
      count++;
    }
  }
  return count;
};

Leuko.prototype.eatPlasma = function (plasma) {
  if (this.count('germ') <= 3) {
    this.goTo({x: plasma.pos.x-16+Math.random()*32, y: plasma.pos.y-16+Math.random()*32});
  }
  this.radius += 0.02;
};

Leuko.prototype.replicate = function () {
    var dnaCopy; var mutationFactor; var aa;
    mutationFactor = Math.random()*5;
    if (mutationFactor < 2.5) { mutationFactor = 0; }
    dnaCopy = {
      moveSpeed: this.dna.moveSpeed + (Math.random()-0.5)*mutationFactor,
      initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
      mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
      germAttraction: this.dna.germAttraction + (Math.random()-0.5)*mutationFactor,
    };
    if (dnaCopy.initRadius < 1) { dnaCopy.initRadius = 2; }
    if (dnaCopy.moveSpeed < 1) { dnaCopy.initRadius = 2; }
    if (dnaCopy.mitosisRadius < 2) { dnaCopy.initRadius = 3; }
    if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
    if (this.count('germ') > this.count('leuko') || Math.random() > 0.85) {
      objects.push(new Leuko(objects.length, this.pos.x, this.pos.y, dnaCopy));
    } else {
      this.age = 0;
      for (aa=0; aa < 10; aa++) {
        objects.push(new Protein(objects.length, this.pos.x-16+(Math.random()*32), this.pos.y-16+(Math.random()*32)));
      }
    }
    window.cooldown = 32;
    this.radius = this.dna.initRadius;
};

module.exports = Leuko;
