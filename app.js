var md2model = require('./model.js').md2model;

var SDL = require( '../node-sdl/sdl' );
var GL = require('../node-opengl/opengl');

function drawStuff() {
  // initialize SDL video components
  SDL.init( SDL.INIT.VIDEO );

  // set up OpenGL
  SDL.GL.setAttribute(SDL.GL.DOUBLEBUFFER, 1);
  SDL.GL.setAttribute(SDL.GL.DEPTH_SIZE, 16);
  SDL.GL.setAttribute(SDL.GL.RED_SIZE, 8);
  SDL.GL.setAttribute(SDL.GL.GREEN_SIZE, 8);
  SDL.GL.setAttribute(SDL.GL.BLUE_SIZE, 8);
  SDL.GL.setAttribute(SDL.GL.ALPHA_SIZE, 8);

  // create a window to draw in
  // SDL.SURFACE.OPENGL | SDL.SURFACE.FULLSCREEN
  //var screen = SDL.setVideoMode( 640, 480, 32, SDL.SURFACE.OPENGL);

  loadModel();
  //redraw();
}

function redraw() {
  // start with a clear screen
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

  // draw the model
  loadModel();

  // swap the buffers
  SDL.GL.swapBuffers();
}

// quit 
function quit ( exitCode ) {
  process.exit( exitCode );
}

/** SDL key event handlers **/
SDL.events.on('QUIT', function(evt) {
  console.log("Quit pushed.");
  quit(0);
});

SDL.events.on('KEYDOWN', function (evt) {
  console.log("Keydown: " + JSON.stringify(evt));

  // Ctrl+Q
  if (evt.sym && (113 == evt.sym) && evt.mod && (64 == evt.mod)) {
    quit(0); 
  }
});


function loadModel() {
var mod = new md2model();

mod.load("tris.md2", function(status) {
  console.log("Model loaded.");

  console.log(mod.header);

console.log(mod.frames[0].nvertices);


  quit(0);
});



}

loadModel();
