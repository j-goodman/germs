Window.newGame = function () {
  var initializeCanvas; var initializeKeyControls; var initializeWorld; var intervalFunction; var play;
  // 1. REQUIRE DEPENDENCIES
  var objects; var Cell; var Clicker; var Blank; var Plasma; var Protein; var Germ;
  objects = require('./objects.js');
  Cell = require('./cell.js');
  Germ = require('./germ.js');
  Plasma = require('./plasma.js');
  Clicker = require('./clicker.js');
  Protein = require('./protein.js');
  Blank = require('./blank.js');

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
