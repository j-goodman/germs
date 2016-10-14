var Util = {};

Util.inherits = function (ChildClass, BaseClass) {
  function Surrogate () { this.constructor = ChildClass; }
  Surrogate.prototype = BaseClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.distanceBetween = function (firstPos, secondPos) {
  xGap = Math.abs(firstPos.x - secondPos.x);
  yGap = Math.abs(firstPos.y - secondPos.y);
  return(Math.sqrt(xGap*xGap+yGap*yGap));
};

module.exports = Util;
