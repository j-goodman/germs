var Clicker; var objects;

objects = require('./objects.js');

Clicker = function (index) {
  this.index = index;
  this.name = 'clicker';
  this.upperLeft = {x: 0, y: 0};
  this.lowerRight = {x: 0, y: 0};
  this.active = false;
};

Clicker.prototype.init = function () {
  var isBetween;

  isBetween = function (checkPos, onePos, twoPos) {
    lesserX = onePos.x < twoPos.x ? onePos.x : twoPos.x;
    lesserY = onePos.y < twoPos.y ? onePos.y : twoPos.y;
    greaterX = onePos.x >= twoPos.x ? onePos.x : twoPos.x;
    greaterY = onePos.y >= twoPos.y ? onePos.y : twoPos.y;
    return (
      checkPos.x > lesserX &&
      checkPos.x < greaterX &&
      checkPos.y > lesserY &&
      checkPos.y < greaterY
    );
  };

  document.onmousedown = function (event) {
    if (event.button === 0 && !event.ctrlKey) {
      this.active = true;
      this.upperLeft = this.lowerRight = {x: event.offsetX, y: event.offsetY};
    }
    if (event.ctrlKey || event.button === 2) {
      var oo;
      for (oo=0; oo < objects.length; oo++) {
        if (objects[oo] && objects[oo].name=='germ' && objects[oo].active) {
          objects[oo].goTo({x: event.offsetX, y: event.offsetY});
        }
      }
    }
  }.bind(this);

  document.oncontextmenu = function (event) {
    return false;
  };

  document.onrightmousedown = function (event) {
    console.log('blast');
  }.bind(this);

  document.onmouseup = function (event) {
    if (!event.crtlKey) {
      var ii;
      if (event.button === 0) {
        this.active = false;
        for (ii=0; ii < objects.length; ii++) {
          if (objects[ii] && objects[ii].name === 'germ') {
            if (isBetween({
              x:objects[ii].pos.x+objects[ii].radius/2,
              y:objects[ii].pos.y+objects[ii].radius/2
            }, this.lowerRight, this.upperLeft)) {
              objects[ii].active = true;
            } else {
              objects[ii].active = false;
            }
          }
        }
      }
    }
  }.bind(this);

  document.onmousemove = function (event) {
    if (this.active) {
      this.lowerRight = {x: event.offsetX, y: event.offsetY};
    }
  }.bind(this);
};

Clicker.prototype.draw = function (ctx) {
  if (this.active) {
    ctx.rect(
      this.upperLeft.x,
      this.upperLeft.y,
      this.lowerRight.x-this.upperLeft.x,
      this.lowerRight.y-this.upperLeft.y
    );
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
};

Clicker.prototype.act = function () {

};

module.exports = Clicker;
