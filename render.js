var GL = require('../node-opengl/opengl');

function drawModel() {
  // start rotation for drawing
  GL.pushMatrix();

  GL.rotate([-90, 1, 0, 0]);
  GL.rotate([-90, 0, 0, 1]);

  // render model frame
  renderFrame();

  // end rotation
  GL.popMatrix();
}

function interpolate(vertices) {
  for (var i = 0; i++; i < vertices.length) {
  
  }
}

function renderFrame() {
}
