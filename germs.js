/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	Window.newGame = function () {
	  var initializeCanvas; var initializeKeyControls; var initializeWorld; var intervalFunction; var play;
	  // 1. REQUIRE DEPENDENCIES
	  var objects; var Cell; var Clicker; var Blank; var Plasma; var Protein; var Germ;
	  objects = __webpack_require__(1);
	  Cell = __webpack_require__(2);
	  Germ = __webpack_require__(4);
	  Plasma = __webpack_require__(6);
	  Clicker = __webpack_require__(7);
	  Protein = __webpack_require__(5);
	  Blank = __webpack_require__(8);
	
	  // 2. INITIALIZE CANVAS
	  initializeCanvas = function () {
	    window.onload = function () {
	      var canvas; var ctx;
	      canvas = document.getElementById("canvas");
	      canvas.height = window.innerHeight*0.96;
	      canvas.width = window.innerWidth*0.96;
	      ctx = canvas.getContext('2d');
	      this.canvas = canvas;
	      this.ctx = ctx;
	      ctx.clearRect(0, 0, canvas.width, canvas.height);
	    }.bind(this);
	    window.onresize = function () {
	      canvas.height = window.innerHeight*0.96;
	      canvas.width = window.innerWidth*0.96;
	    };
	  };
	
	  // 3. INITIALIZE KEY CONTROLS
	  initializeKeyControls = function () {};
	
	  // 4. INITIALIZE WORLD
	  initializeWorld = function () {
	    var clicker; var ff;
	    clicker = new Clicker(objects.length);
	    clicker.init();
	    objects.push(clicker);
	    for (ff=0; ff < 12; ff++) {
	      objects.push(new Plasma(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    for (ff=0; ff < 120; ff++) {
	      objects.push(new Protein(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    objects.push(new Germ(objects.length, 100+Math.random()*650, 20+Math.pow((Math.random()*20), 2)));
	    objects.push(new Germ(objects.length, 100+Math.random()*650, 20+Math.pow((Math.random()*20), 2)));
	  };
	
	  // 5. DEFINE INTERVAL FUNCTION
	  intervalFunction = function () {
	    var xx;
	    ctx.fillStyle = '#667766';
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    for (xx=0; xx < objects.length; xx++) {
	      if (objects[xx]) {
	        objects[xx].draw(ctx);
	        objects[xx].act();
	      }
	    }
	    console.log(objects.length);
	  };
	
	  // 5. PLAY
	  play = function () {
	    var interval; var xx;
	    initializeWorld();
	    interval = setInterval(intervalFunction, 32);
	  };
	  initializeCanvas();
	  play();
	};
	
	Window.newGame();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var objects = [];
	module.exports = objects;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Cell; var Util; var objects;
	objects = __webpack_require__(1);
	Util = __webpack_require__(3);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Germ; var Cell; var Util; var Protein;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	Protein = __webpack_require__(5);
	objects = __webpack_require__(1);
	
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
	
	Germ.prototype.act = function () {
	  var aa;
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.color = this.active ? '#ee3333' : '#bb0000';
	  if (this.radius > 11) {
	    this.radius = 6;
	    objects.push(new Germ(objects.length, this.pos.x, this.pos.y));
	    for (aa=0; aa < 7; aa++) {
	      objects.push(new Protein(objects.length, this.pos.x-16+Math.random()*32, this.pos.y-16+Math.random()*32));
	    }
	  }
	};
	
	Germ.prototype.eatPlasma = function (plasma) {
	  this.goTo({x: plasma.pos.x-32+Math.random()*64, y: plasma.pos.y-32+Math.random()*64});
	  this.radius += 0.02;
	};
	
	module.exports = Germ;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Protein; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	objects = __webpack_require__(1);
	
	Protein = function (index, x, y) {
	  this.index = index;
	  this.name = 'protein';
	  this.moveSpeed = 1;
	  this.active = false;
	  this.color = '#00bb00';
	  this.radius = 4;
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
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  this.checkCollisions();
	};
	
	Protein.prototype.checkCollisions = function () {
	  var jj;
	  for (jj=0; jj < objects.length; jj++) {
	    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
	      if (objects[jj].name === 'plasma') {
	        this.radius -= 0.02;
	        if (this.radius < 2) {
	          objects[jj].eatProtein();
	          this.destroy();
	        }
	      }
	    }
	  }
	};
	
	
	module.exports = Protein;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Plasma; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	objects = __webpack_require__(1);
	
	Plasma = function (index, x, y) {
	  this.index = index;
	  this.name = 'plasma';
	  this.moveSpeed = 3;
	  this.active = false;
	  this.color = '#0000bb';
	  this.radius = 10;
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
	};
	
	Plasma.prototype.seekProtein = function () {
	  var target;
	  target = this.findNearest('protein');
	  if (target) {
	    this.goTo(target.pos);
	  }
	};
	
	Plasma.prototype.eatProtein = function () {
	  this.radius += 2;
	  if (this.radius > 19) {
	    objects.push(new Plasma(objects.length, this.pos.x, this.pos.y));
	    this.radius = 10;
	  }
	};
	
	Plasma.prototype.checkCollisions = function () {
	  var jj;
	  for (jj=0; jj < objects.length; jj++) {
	    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
	      if (objects[jj].name === 'germ') {
	        if (this.radius < 4) {
	          this.destroy();
	        } else {
	          this.radius -= 0.04;
	          objects[jj].eatPlasma(this);
	        }
	      }
	    }
	  }
	};
	
	
	module.exports = Plasma;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Clicker; var objects;
	
	objects = __webpack_require__(1);
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	var Blank;
	Blank = function (index) {
	  this.index = index;
	  this.name = 'blank';
	};
	
	Blank.prototype.draw = function (ctx) {
	};
	
	Blank.prototype.act = function () {
	};
	
	module.exports = Blank;


/***/ }
/******/ ]);
//# sourceMappingURL=germs.js.map