/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var canvas = document.createElement('canvas');
	canvas.width = 768;
	canvas.height = 768;
	document.getElementById('canvas').appendChild(canvas);
	var ctx = canvas.getContext('2d');

	var red = '#CC523E';
	var blue = '#698DCC';

	var render = function () {
	  ctx.save();
	  ctx.clearRect(0, 0, canvas.width, canvas.height);

	  // The grid for the tic-tac-toe board
	  var gridImage = new Image();

	  // This onload event does the rendering the first time this image is used.
	  // After that, the image is cached and loads instantly.
	  gridImage.onload = function () {
	    ctx.drawImage(gridImage, 0, 0, 768, 768);
	  };
	  gridImage.src = '/grid.svg';
	  ctx.drawImage(gridImage, 0, 0, 768, 768);

	  // Loop through and render the squares on the board
	  for(var i = 0; i < TTGrid.length; i++) {
	    for(var j = 0; j < TTGrid[i].length; j++) {
	      if (TTGrid[i][j].filledWith) {
	        var squareCoords = toCanvasGrid({x: i, y: j});

	        squareCoords.x = squareCoords.x + 32;
	        squareCoords.y = squareCoords.y + 32;

	        ctx.drawImage(TTGrid[i][j].filledWith, squareCoords.x, squareCoords.y, 192, 192);
	      }
	    }
	  }

	  // If there's a winner, show who won
	  if (TTGameWinner) {
	    var winnerName;
	    if(TTGameWinner == TTX) {
	      winnerName = 'Red';
	      ctx.fillStyle = red;
	    } else {
	      winnerName = 'Blue';
	      ctx.fillStyle = blue;
	    }

	    ctx.fillRect(0, 352, 768, 64);

	    ctx.font = '48px sans-serif';
	    ctx.fillStyle = 'white';
	    ctx.textBaseline = 'middle';
	    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
	    ctx.shadowBlur = 4;
	    ctx.shadowOffsetY = 0;
	    ctx.textAlign = 'center';
	    ctx.fillText(winnerName + ' wins!', 384, 384);
	  }

	  ctx.restore();
	  requestAnimationFrame(render);
	};

	// Class for a tic-tac-toe square
	var TTSquare = function () {
	  this.filled = false;
	  this.filledWith = null;
	};

	// Fill this square with the appropriate image for the next turn in the
	// game. Determine after filling if this ends the game.
	// Don't do all this if the game is over.
	TTSquare.prototype.fill = function () {
	  if (TTGameOver) {
	    return;
	  }

	  if (this.filled) {
	    return;
	  }

	  this.filled = true;
	  this.filledWith = TTNextFill;

	  if (TTNextFill === TTX) {
	    TTNextFill = TTCircle;
	  } else {
	    TTNextFill = TTX;
	  }

	  determineWinner();
	};

	var TTX = new Image();
	TTX.src = '/x.svg';

	var TTCircle = new Image();
	TTCircle.src = '/circle.svg';

	var TTGameWinner;
	var TTGameOver;
	var TTNextFill;
	var TTGrid;

	// Reset the game
	var resetGame = function () {
	  TTGameWinner = null;
	  TTGameOver = false;
	  TTNextFill = TTX;
	  TTGrid = [
	    [
	      new TTSquare(),
	      new TTSquare(),
	      new TTSquare()
	    ],
	    [
	      new TTSquare(),
	      new TTSquare(),
	      new TTSquare()
	    ],
	    [
	      new TTSquare(),
	      new TTSquare(),
	      new TTSquare()
	    ]
	  ];
	};

	// convert a pixel coordinate (the size of the canvas) to a game coordinate
	// (a 0-indexed tic-tac-toe grid)
	var toTTGrid = function (coords) {
	  var grid = {
	    x: 0,
	    y: 0
	  };

	  grid.x = parseInt(coords.x/256);
	  grid.y = parseInt(coords.y/256);

	  return grid;
	};

	var toCanvasGrid = function (coords) {
	  var grid = {
	    x: 0,
	    y: 0
	  };

	  grid.x = coords.x * 256;
	  grid.y = coords.y * 256;

	  return grid;
	};

	// Determine if there's a winning position on the board. Modify TTGameWinner
	// and TTGameOver accordingly
	var determineWinner = function () {
	  var winner = null;

	  // There are 8 winning positions (3 horizontal, 3 vertical, 2 diagonal)
	  winningVectors = [
	    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
	    [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
	    [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}],
	    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
	    [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
	    [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
	    [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
	    [{x: 2, y: 0}, {x: 1, y: 1}, {x: 0, y: 2}]
	  ];

	  winningVectors.forEach(function (vector) {
	    var fillers = [
	      TTGrid[vector[0].x][vector[0].y].filledWith,
	      TTGrid[vector[1].x][vector[1].y].filledWith,
	      TTGrid[vector[2].x][vector[2].y].filledWith
	    ];

	    if (
	      fillers[0] == fillers[1] &&
	      fillers[1] == fillers[2] &&
	      fillers[0] !== null
	      ) {
	      winner = fillers[0];
	    }
	  });

	  if (winner !== null) {
	    TTGameOver = true;
	    TTGameWinner = winner;
	  }
	};

	var clickOrTapHandler = function (e) {
	  // Prevent taps from turning into clicks
	  e.preventDefault();

	  var eventPos = {
	    x: e.clientX || e.changedTouches[0].clientX,
	    y: e.clientY || e.changedTouches[0].clientY
	  };

	  var canvasPos = {
	    x: 0,
	    y: 0
	  };

	  canvasPos.x = (eventPos.x - canvas.offsetLeft) * canvas.width / canvas.offsetWidth;
	  canvasPos.y = (eventPos.y - canvas.offsetTop) * canvas.height / canvas.offsetHeight;

	  var ttCoords = toTTGrid(canvasPos);

	  TTGrid[ttCoords.x][ttCoords.y].fill(TTNextFill);
	};

	canvas.addEventListener('click', clickOrTapHandler);
	canvas.addEventListener('touchend', clickOrTapHandler);


	document.getElementById('reset-game').addEventListener('click', function () {
	  resetGame();
	});

	// Reset (initialize) the game and kick off the render loop!
	resetGame();
	requestAnimationFrame(render);


/***/ }
/******/ ]);