var Buffer = require('buffer').Buffer;
var pack = require('jspack').jspack;

// add buffer prototype functions for ease of use
Buffer.prototype.int = function(offset) {
  return pack.Unpack('<i', this, offset);
};

Buffer.prototype.short = function(offset) {
  return pack.Unpack('<h', this, offset);
}

Buffer.prototype.float = function(offset) {
  return pack.Unpack('<f', this, offset);
}

Buffer.prototype.uchar = function(offset) {
  return pack.Unpack('<B', this, offset);
}

Buffer.prototype.char = function(offset) {
  return pack.Unpack('<c', this, offset);
}


