var Cell; var Util; var objects;
objects = require('./objects.js');
Util = require('./util.js');
Cell = function () {};

Cell.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
};

Cell.prototype.goTo = function (dest) {
  this.moveTowards(dest);
  window.clearInterval(this.interval);
  this.interval = window.setInterval(function () {
    var xOff; var yOff;
    tempDest = {
      x: dest.x,
      y: dest.y,
    };
    xOff = (Math.random()*100)-50;
    yOff = (Math.random()*100)-50;
    tempDest.x += xOff;
    tempDest.y += yOff;
    this.moveTowards(tempDest);
    if (Math.abs(this.pos.x - dest.x) < xOff+8 && Math.abs(this.pos.y - dest.y) < yOff+8) {
      this.speed = {
        x: 0,
        y: 0,
      };
      window.clearInterval(this.interval);
    }
  }.bind(this), 1800-(Math.random()*1800));
};

Cell.prototype.moveTowards = function (dest) {
  this.speed.x = -((this.pos.x - dest.x)/(Math.sqrt(
    Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
  )/this.moveSpeed));
  this.speed.y = -((this.pos.y - dest.y)/(Math.sqrt(
    Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
  )/this.moveSpeed));
};

Cell.prototype.destroy = function () {
  objects[this.index] = undefined;
};

Cell.prototype.findNearest = function (name) {
  var kk; var closest; var closeDist;
  closeDist = 1000;
  for (kk=0; kk < objects.length; kk++) {
    if (objects[kk] && objects[kk].name === name) {
      if (Util.distanceBetween(objects[kk].pos, this.pos) < closeDist) {
        closest = objects[kk];
        closeDist = Util.distanceBetween(objects[kk].pos, this.pos);
      }
    }
  }
  return closest;
};

module.exports = Cell;
