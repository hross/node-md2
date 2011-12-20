var fs = require('fs');
var packbuffer = require('./packbuffer.js');
var Binary = require('binary');

function md2model() {
  this.header = {};
  this.glcmds = [];
  this.frames = [];
}

md2model.prototype.loadSkins = function(buffer) {
}

md2model.prototype.loadTextures = function(buffer) {
}

md2model.prototype.loadGLCommands = function(buffer) {
  this.glcmds = [];
  for (var i = 0; i < this.header.num_glcmds; i++) {
    this.glcmds.push(buffer.int(i*4));
  }
};

md2model.prototype.loadFrames = function(buffer) {
  this.frames = [];
  for (var i = 0; i < this.header.num_frames; i++) {
    var offset = i * this.header.framesize;
    var frame = {};

    frame.scale = [buffer.float(offset), buffer.float(offset+8), buffer.float(offset+16)]; // 3 floats
    frame.translate = [buffer.float(offset+24), buffer.float(offset+32), buffer.float(offset+40)]; // 3 floats
    frame.name = buffer.toString('utf8',offset+48,offset+55); // 16 chars

    frame.vertices = [];
    frame.nvertices = [];
    for (var j =0; j < header.num_xyz; j++) { 
      var vertex = {vertex: 
        [buffer.uchar(offset+56+(j*4)), buffer.uchar(offset+57+(j*4)), buffer.uchar(offset+58+(j*4))],
      lightnormalindex: buffer.uchar(offset+59+(j*4)) 
      }; // 3 bytes + 1 byte

      // calculate 3d vert coordinates
      var v3d = [];
      v3d.push(vertex.vertex[0]*frame.scale[0]+frame.translate[0]);
      v3d.push(vertex.vertex[1]*frame.scale[1]+frame.translate[1]);
      v3d.push(vertex.vertex[2]*frame.scale[2]+frame.translate[2]);

      // add regular and normalized vertex to frame
      frame.vertices.push(vertex); 
      frame.nvertices.push(v3d);
    }

    this.frames.push(frame);
  }
}

md2model.prototype.load = function(filename, callback) {
  var that = this;
  
  fs.open(filename, 'r', function(status, fd) {
    // file read error
    if (status) {
      callback(status);
      return;
    }

    // read md2 header
    var hbuffer = new Buffer(68);
    fs.readSync(fd, hbuffer, 0, 68, 0);

    that.header = Binary.parse(hbuffer)
    .word32ls('magic')
    .word32ls('version')
    .word32ls('skinwidth')
    .word32ls('skinheight')
    .word32ls('framesize')
    .word32ls('num_skins')
    .word32ls('num_xyz')
    .word32ls('num_st')
    .word32ls('num_tris')
    .word32ls('num_glcmds')
    .word32ls('num_frames')
    .word32ls('ofs_skins')
    .word32ls('ofs_st')
    .word32ls('ofs_tris')
    .word32ls('ofs_frames')
    .word32ls('ofs_glcmds')
    .word32ls('ofs_end')
    .vars
    ;

    header = that.header;

    if (header.num_skins) {
      var skinbuffer = new Buffer(64 * header.num_skins);
      fs.readSync(fd, skinbuffer, 0, 64 * header.num_skins, header.ofs_skins);
      that.loadSkins(skinbuffer);
    }

    if (that.header.ofs_st) {
      // short * 2 for each texture coordinate (short = 2 bytes)
      var stbuffer = new Buffer(4 * header.num_st);
      fs.readSync(fd, stbuffer, 0, 4 * header.num_st, header.ofs_st);
      that.loadTextures(stbuffer); 
    }

    if (that.header.num_glcmds) {
      // array of 4 byte ints
      var glbuffer = new Buffer(4 * header.num_glcmds);
      fs.readSync(fd, glbuffer, 0, 4 * header.num_glcmds, header.ofs_glcmds);
      that.loadGLCommands(glbuffer);
    }

    if (header.num_frames) {
      var fbuffer = new Buffer(header.framesize * header.num_frames);
      fs.readSync(fd, fbuffer, 0, header.framesize * header.num_frames, header.ofs_frames);
      that.loadFrames(fbuffer);
    }

    callback(0);
  });
}

exports.md2model = md2model;
