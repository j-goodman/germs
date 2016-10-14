var Germ; var Cell; var Util;
Util = require('./util.js');
Cell = require('./cell.js');
objects = require('./objects.js');

Germ = function (index, x, y) {
  this.index = index;
  this.name = 'germ';
  this.moveSpeed = 2;
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

Germ.prototype.act = function () {
  this.pos.x += this.speed.x;
  this.pos.y += this.speed.y;
  this.color = this.active ? '#ee3333' : '#bb0000';
  if (this.radius > 11) {
    this.radius = 6;
    objects.push(new Germ(objects.length, this.pos.x, this.pos.y));
  }
};

Germ.prototype.eatPlasma = function (plasma) {
  this.goTo({x: plasma.pos.x-32+Math.random()*64, y: plasma.pos.y-32+Math.random()*64});
  this.radius += 0.01;
};

module.exports = Germ;
