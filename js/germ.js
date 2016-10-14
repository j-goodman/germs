var Germ; var Cell; var Util; var Protein;
Util = require('./util.js');
Cell = require('./cell.js');
Protein = require('./protein.js');
objects = require('./objects.js');

Germ = function (index, x, y) {
  this.index = index;
  this.name = 'germ';
  this.moveSpeed = 4;
  this.active = false;
  this.color = '#bb0000';
  this.radius = 6;
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

Germ.prototype.act = function () {
  var aa;
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.color = this.active ? '#ee3333' : '#bb0000';
  if (this.radius > 11) {
    this.radius = 6;
    if (window.cooldown < 0) {
      objects.push(new Germ(objects.length, this.pos.x, this.pos.y));
      for (aa=0; aa < 12; aa++) {
        objects.push(new Protein(objects.length, this.pos.x-16+Math.random()*32, this.pos.y-16+Math.random()*32));
      }
      window.cooldown = 32;
    }
  }
  // if (!Math.floor(Math.random()*60)) { this.seekPlasma(); }
};

Germ.prototype.eatPlasma = function (plasma) {
  this.goTo({x: plasma.pos.x-32+Math.random()*64, y: plasma.pos.y-32+Math.random()*64});
  this.radius += 0.02;
};

module.exports = Germ;
