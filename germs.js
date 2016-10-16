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
	  Leuko = __webpack_require__(7);
	  Clicker = __webpack_require__(9);
	  Protein = __webpack_require__(5);
	  Blank = __webpack_require__(10);
	
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
	    var clicker; var ff; var count;
	    count = {
	      leuko: 2,
	      germ: 4,
	      plasma: 26,
	      protein: 240,
	    };
	    clicker = new Clicker(objects.length);
	    clicker.init();
	    objects.push(clicker);
	    for (ff=0; ff < count.plasma; ff++) {
	      objects.push(new Plasma(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    for (ff=0; ff < count.protein; ff++) {
	      objects.push(new Protein(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    for (ff=0; ff < count.germ; ff++) {
	      objects.push(new Germ(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    for (ff=0; ff < count.leuko; ff++) {
	      objects.push(new Leuko(objects.length, Math.random()*window.innerWidth*0.96, Math.random()*window.innerHeight*0.96));
	    }
	    window.cooldown = 0;
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
	    window.cooldown -= 1;
	    // console.log(objects.length);
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
	  if (this.radius < 0) {
	    this.radius = 1;
	  }
	  if (this.alpha) {
	    ctx.globalAlpha = this.alpha;
	  }
	  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	  ctx.globalAlpha = 1;
	};
	
	Cell.prototype.goTo = function (dest, neg) {
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
	    this.moveTowards(tempDest, neg);
	    if (Math.abs(this.pos.x - dest.x) < xOff+8 && Math.abs(this.pos.y - dest.y) < yOff+8) {
	      this.speed = {
	        x: 0,
	        y: 0,
	      };
	      window.clearInterval(this.interval);
	    }
	  }.bind(this), 1800-(Math.random()*1800));
	};
	
	Cell.prototype.moveTowards = function (dest, neg) {
	  if (!neg) {
	    this.speed.x = -((this.pos.x - dest.x)/(Math.sqrt(
	      Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
	    )/this.dna.moveSpeed));
	    this.speed.y = -((this.pos.y - dest.y)/(Math.sqrt(
	      Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
	    )/this.dna.moveSpeed));
	  } else {
	    this.speed.x = ((this.pos.x - dest.x)/(Math.sqrt(
	      Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
	    )/this.dna.moveSpeed));
	    this.speed.y = ((this.pos.y - dest.y)/(Math.sqrt(
	      Math.pow((this.pos.x - dest.x), 2) + Math.pow((this.pos.y - dest.y), 2)
	    )/this.dna.moveSpeed));
	  }
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Protein; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	objects = __webpack_require__(1);
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Plasma; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	objects = __webpack_require__(1);
	
	Plasma = function (index, x, y, dna) {
	  this.index = index;
	  this.name = 'plasma';
	  this.age = 0;
	  this.active = false;
	  this.color = '#0000bb';
	  if (!dna) {
	    this.dna = {
	      moveSpeed: 1,
	      initRadius: 8,
	      mitosisRadius: 14,
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
	
	Util.inherits(Plasma, Cell);
	
	Plasma.prototype.act = function () {
	  this.pos.x += this.speed.x;
	  this.pos.y += this.speed.y;
	  if (!Math.floor(Math.random()*60)) {
	    this.seekProtein();
	  }
	  this.checkCollisions();
	  this.age += 1;
	  if (this.age > 1800) {
	    this.radius -= 0.01;
	  }
	  if (this.radius < this.dna.initRadius/2) {
	    this.destroy();
	  }
	};
	
	Plasma.prototype.seekProtein = function () {
	  var target;
	  target = this.findNearest('protein');
	  if (target) {
	    this.goTo(target.pos);
	  }
	};
	
	Plasma.prototype.eatProtein = function () {
	  this.radius += 0.02;
	  if (this.radius > this.dna.mitosisRadius && window.cooldown < 0) {
	    this.replicate();
	  }
	  if (this.radius > this.dna.mitosisRadius) { this.radius = this.dna.mitosisRadius; }
	};
	
	Plasma.prototype.checkCollisions = function () {
	  var jj;
	  for (jj=0; jj < objects.length; jj++) {
	    if (objects[jj] && objects[jj].pos && objects[jj].radius && Util.distanceBetween(objects[jj].pos, this.pos) < this.radius+objects[jj].radius) {
	      if (objects[jj].name === 'germ' || objects[jj].name === 'leuko') {
	        this.radius -= 0.02;
	        objects[jj].eatPlasma(this);
	      }
	    }
	  }
	};
	
	Plasma.prototype.replicate = function () {
	  var dnaCopy; var mutationFactor;
	  mutationFactor = Math.random()*5;
	  if (mutationFactor < 2.5) { mutationFactor = 0; }
	  dnaCopy = {
	    moveSpeed: this.dna.moveSpeed + (Math.random()-0.5)*mutationFactor,
	    initRadius: this.dna.initRadius + (Math.random()-0.5)*mutationFactor,
	    mitosisRadius: this.dna.mitosisRadius + (Math.random()-0.5)*mutationFactor,
	  };
	  if (dnaCopy.initRadius < 1) { dnaCopy.initRadius = 2; }
	  if (dnaCopy.moveSpeed < 1) { dnaCopy.initRadius = 2; }
	  if (dnaCopy.mitosisRadius < 2) { dnaCopy.initRadius = 3; }
	  if (dnaCopy.mitosisRadius < dnaCopy.initRadius) { dnaCopy.mitosisRadius = dnaCopy.initRadius + 0.5; }
	  objects.push(new Plasma(objects.length, this.pos.x, this.pos.y, dnaCopy));
	  objects.push(new Plasma(objects.length, this.pos.x, this.pos.y, dnaCopy));
	  window.cooldown = 32;
	  this.radius = this.dna.initRadius;
	};
	
	module.exports = Plasma;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Leuko; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	Protein = __webpack_require__(5);
	Parasite = __webpack_require__(8);
	objects = __webpack_require__(1);
	
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
	    if (this.count('parasite') < 1) {
	      objects.push(new Parasite(objects.length, this.pos.x, this.pos.y, undefined, this));
	    }
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
	  this.checkCollisions();
	};
	
	Leuko.prototype.checkCollisions = function () {
	  var ee;
	  for (ee=0; ee < objects.length; ee++) {
	    if (objects[ee] && objects[ee].pos && objects[ee].radius && Util.distanceBetween(objects[ee].pos, this.pos) < this.radius+objects[ee].radius) {
	      if (objects[ee].name === 'parasite') {
	        this.radius -= 0.004*this.radius/10;
	        objects[ee].eatLeuko(this);
	      }
	    }
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Parasite; var Cell; var Util;
	Util = __webpack_require__(3);
	Cell = __webpack_require__(2);
	Protein = __webpack_require__(5);
	objects = __webpack_require__(1);
	
	Parasite = function (index, x, y, dna, host) {
	  this.index = index;
	  this.name = 'parasite';
	  this.age = 0;
	  this.active = false;
	  this.host = host;
	  this.color = '#440022';
	  this.alpha = 1;
	  if (!dna) {
	    this.dna = {
	      moveSpeed: 1,
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
	  this.age += 1;
	  this.goTo(this.host);
	  if (this.age > 1800) {
	    this.radius -= 0.005;
	  }
	  if (this.radius < this.dna.initRadius/4) {
	    this.destroy();
	  }
	  if (this.radius > this.dna.mitosisRadius && (!Math.floor(Math.random()*100) || window.cooldown < 0)) {
	    this.replicate();
	  }
	  if (Math.floor(Math.random()*2200) < this.dna.leukoAttraction) {
	    this.switchHost();
	  }
	};
	
	Parasite.prototype.seekGerm = function () {
	  var target;
	  target = this.findNearest('germ');
	  if (target) {
	    this.goTo(target.pos);
	  }
	};
	
	Parasite.prototype.switchHost = function () {
	  var target;
	  target = this.getRandom('leuko', 'germ');
	  if (target) {
	    this.host = target;
	  }
	};
	
	Cell.prototype.getRandom = function (name, otherName) {
	  var kk; var list;
	  list = [];
	  for (kk=0; kk < objects.length; kk++) {
	    if (objects[kk] && (objects[kk].name === name || objects[kk].name === otherName)) {
	      list.push(objects[kk]);
	    }
	  }
	  return list[Math.round(Math.random()*list.length)];
	};
	
	Parasite.prototype.eatLeuko = function (leuko) {
	  if (Math.round(Math.random()) && Util.distanceBetween(this.pos, leuko.pos < leuko.radius+this.radius)) {
	    this.speed = leuko.speed;
	  } else {
	    this.goTo({x: leuko.pos.x, y: leuko.pos.y});
	  }
	  this.radius += 0.004*leuko.radius/6;
	  if (this.radius > this.dna.mitosisRadius+0.2) { this.radius = this.dna.mitosisRadius; }
	};
	
	Parasite.prototype.eatGerm = function (germ) {
	  if (Math.round(Math.random()) && Util.distanceBetween(this.pos, germ.pos < germ.radius+this.radius)) {
	    this.speed = germ.speed;
	  } else {
	    this.goTo({x: germ.pos.x, y: germ.pos.y});
	  }
	  this.radius += 0.004;
	  this.goTo({x: this.host.pos.x, y: this.host.pos.y});
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
	  objects.push(new Parasite(objects.length, this.pos.x, this.pos.y, dnaCopy, this.host));
	  this.radius = this.dna.initRadius;
	  window.cooldown = 32;
	};
	
	module.exports = Parasite;


/***/ },
/* 9 */
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
/* 10 */
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