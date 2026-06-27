// Tiny QR Code generator — MIT license, adapted from Project Nayuki's QR-Code-generator
// Renders to a canvas. Usage: QR.draw(canvas, text, opts)
// Supports up to ~150 chars at error correction L. Plenty for a URL.
(function(global){
'use strict';

// QR Code generation, minimal implementation. Supports ECC level L, byte mode, versions 1-10.
function QrCode(version, ecl, dataCodewords, mask) {
  this.version = version;
  this.size = version * 4 + 17;
  this.errorCorrectionLevel = ecl;
  this.mask = mask;
  this.modules = [];
  this.isFunction = [];
  for (var i=0;i<this.size;i++){ this.modules.push(new Array(this.size).fill(false)); this.isFunction.push(new Array(this.size).fill(false)); }
  this.drawFunctionPatterns();
  var allCodewords = this.addEccAndInterleave(dataCodewords);
  this.drawCodewords(allCodewords);
  this.applyMask(mask);
  this.drawFormatBits(mask);
}

QrCode.prototype.drawFunctionPatterns = function() {
  for (var i=0;i<this.size;i++){ this.setFunctionModule(6, i, i%2==0); this.setFunctionModule(i, 6, i%2==0); }
  this.drawFinderPattern(3,3); this.drawFinderPattern(this.size-4,3); this.drawFinderPattern(3,this.size-4);
  var alignPos = this.getAlignmentPatternPositions();
  for (var i=0;i<alignPos.length;i++) for (var j=0;j<alignPos.length;j++){
    if (!(i==0&&j==0)&&!(i==0&&j==alignPos.length-1)&&!(i==alignPos.length-1&&j==0))
      this.drawAlignmentPattern(alignPos[i], alignPos[j]);
  }
  this.drawFormatBits(0);
  this.drawVersion();
};

QrCode.prototype.drawFinderPattern = function(x,y){
  for (var dy=-4;dy<=4;dy++) for (var dx=-4;dx<=4;dx++){
    var dist = Math.max(Math.abs(dx), Math.abs(dy));
    var xx=x+dx, yy=y+dy;
    if (xx>=0&&xx<this.size&&yy>=0&&yy<this.size) this.setFunctionModule(xx,yy, dist!=2&&dist!=4);
  }
};

QrCode.prototype.drawAlignmentPattern = function(x,y){
  for (var dy=-2;dy<=2;dy++) for (var dx=-2;dx<=2;dx++)
    this.setFunctionModule(x+dx, y+dy, Math.max(Math.abs(dx), Math.abs(dy))!=1);
};

QrCode.prototype.setFunctionModule = function(x,y,isDark){
  this.modules[y][x] = isDark; this.isFunction[y][x] = true;
};

QrCode.prototype.drawFormatBits = function(mask){
  var data = this.errorCorrectionLevel<<3 | mask;
  var rem = data;
  for (var i=0;i<10;i++) rem = (rem<<1) ^ ((rem>>>9)*0x537);
  var bits = (data<<10 | rem) ^ 0x5412;
  for (var i=0;i<=5;i++) this.setFunctionModule(8,i, getBit(bits,i));
  this.setFunctionModule(8,7, getBit(bits,6));
  this.setFunctionModule(8,8, getBit(bits,7));
  this.setFunctionModule(7,8, getBit(bits,8));
  for (var i=9;i<15;i++) this.setFunctionModule(14-i,8, getBit(bits,i));
  for (var i=0;i<8;i++) this.setFunctionModule(this.size-1-i,8, getBit(bits,i));
  for (var i=8;i<15;i++) this.setFunctionModule(8,this.size-15+i, getBit(bits,i));
  this.setFunctionModule(8,this.size-8,true);
};

QrCode.prototype.drawVersion = function(){
  if (this.version < 7) return;
  var rem = this.version;
  for (var i=0;i<12;i++) rem = (rem<<1) ^ ((rem>>>11)*0x1F25);
  var bits = this.version<<12 | rem;
  for (var i=0;i<18;i++){
    var bit = getBit(bits,i);
    var a = this.size-11+i%3, b = Math.floor(i/3);
    this.setFunctionModule(a,b,bit); this.setFunctionModule(b,a,bit);
  }
};

QrCode.prototype.getAlignmentPatternPositions = function(){
  if (this.version==1) return [];
  var n = Math.floor(this.version/7) + 2;
  var step = (this.version==32) ? 26 : Math.ceil((this.version*4+4)/(n*2-2))*2;
  var result = [6];
  for (var pos=this.size-7; result.length<n; pos-=step) result.splice(1,0,pos);
  return result;
};

QrCode.prototype.addEccAndInterleave = function(data){
  var ver = this.version, ecl = this.errorCorrectionLevel;
  var numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
  var blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl][ver];
  var rawCodewords = Math.floor(getNumRawDataModules(ver)/8);
  var numShortBlocks = numBlocks - rawCodewords%numBlocks;
  var shortBlockLen = Math.floor(rawCodewords/numBlocks);
  var blocks = []; var rsDiv = reedSolomonComputeDivisor(blockEccLen);
  for (var i=0,k=0;i<numBlocks;i++){
    var dat = data.slice(k, k + shortBlockLen - blockEccLen + (i<numShortBlocks?0:1));
    k += dat.length;
    var ecc = reedSolomonComputeRemainder(dat, rsDiv);
    if (i<numShortBlocks) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  var result = [];
  for (var i=0;i<blocks[0].length;i++) for (var j=0;j<blocks.length;j++)
    if (i!=shortBlockLen-blockEccLen || j>=numShortBlocks) result.push(blocks[j][i]);
  return result;
};

QrCode.prototype.drawCodewords = function(data){
  var i = 0, size = this.size;
  for (var right=size-1; right>=1; right-=2){
    if (right==6) right=5;
    for (var vert=0; vert<size; vert++){
      for (var j=0;j<2;j++){
        var x = right - j;
        var upward = ((right+1) & 2) == 0;
        var y = upward ? size-1-vert : vert;
        if (!this.isFunction[y][x] && i<data.length*8){
          this.modules[y][x] = getBit(data[i>>>3], 7-(i&7));
          i++;
        }
      }
    }
  }
};

QrCode.prototype.applyMask = function(mask){
  for (var y=0;y<this.size;y++) for (var x=0;x<this.size;x++){
    var invert;
    switch(mask){
      case 0: invert = (x+y)%2==0; break;
      case 1: invert = y%2==0; break;
      case 2: invert = x%3==0; break;
      case 3: invert = (x+y)%3==0; break;
      case 4: invert = (Math.floor(x/3)+Math.floor(y/2))%2==0; break;
      case 5: invert = x*y%2 + x*y%3 == 0; break;
      case 6: invert = (x*y%2 + x*y%3)%2 == 0; break;
      case 7: invert = ((x+y)%2 + x*y%3)%2 == 0; break;
    }
    if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
  }
};

function getNumRawDataModules(ver){
  var result = (16*ver + 128)*ver + 64;
  if (ver>=2){
    var numAlign = Math.floor(ver/7)+2;
    result -= (25*numAlign-10)*numAlign-55;
    if (ver>=7) result -= 36;
  }
  return result;
}

var ECC_CODEWORDS_PER_BLOCK = [
  [-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30]
];
var NUM_ERROR_CORRECTION_BLOCKS = [
  [-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25]
];

function reedSolomonComputeDivisor(degree){
  var result = new Array(degree).fill(0);
  result[degree-1] = 1;
  var root = 1;
  for (var i=0;i<degree;i++){
    for (var j=0;j<result.length;j++){
      result[j] = reedSolomonMultiply(result[j], root);
      if (j+1<result.length) result[j] ^= result[j+1];
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonComputeRemainder(data, divisor){
  var result = new Array(divisor.length).fill(0);
  for (var i=0;i<data.length;i++){
    var factor = data[i] ^ result.shift();
    result.push(0);
    for (var j=0;j<divisor.length;j++) result[j] ^= reedSolomonMultiply(divisor[j], factor);
  }
  return result;
}

function reedSolomonMultiply(x,y){
  var z=0;
  for (var i=7;i>=0;i--){
    z = (z<<1) ^ ((z>>>7)*0x11D);
    z ^= ((y>>>i)&1)*x;
  }
  return z;
}

function getBit(x,i){ return ((x>>>i) & 1) != 0; }

function encodeText(text){
  // Byte mode
  var bytes = [];
  for (var i=0;i<text.length;i++){
    var c = text.charCodeAt(i);
    if (c<0x80) bytes.push(c);
    else if (c<0x800){ bytes.push(0xC0|(c>>6)); bytes.push(0x80|(c&0x3F)); }
    else { bytes.push(0xE0|(c>>12)); bytes.push(0x80|((c>>6)&0x3F)); bytes.push(0x80|(c&0x3F)); }
  }
  // Find min version
  for (var ver=1; ver<=10; ver++){
    var capBits = getNumRawDataModules(ver) - ECC_CODEWORDS_PER_BLOCK[0][ver]*NUM_ERROR_CORRECTION_BLOCKS[0][ver]*8;
    // overhead: 4 (mode) + 8 or 16 (length) bits
    var lenBits = ver<10 ? 8 : 16;
    var needBits = 4 + lenBits + bytes.length*8;
    if (needBits <= capBits){
      // Build bit buffer
      var bb = [];
      appendBits(bb, 4, 4); // byte mode
      appendBits(bb, bytes.length, lenBits);
      for (var i=0;i<bytes.length;i++) appendBits(bb, bytes[i], 8);
      // Terminator
      appendBits(bb, 0, Math.min(4, capBits-bb.length));
      while (bb.length%8 != 0) bb.push(false);
      // Pad bytes
      var pad = [0xEC, 0x11];
      for (var i=0; bb.length<capBits; i++) appendBits(bb, pad[i%2], 8);
      // To bytes
      var dataCodewords = [];
      for (var i=0;i<bb.length;i+=8){
        var b=0;
        for (var j=0;j<8;j++) if (bb[i+j]) b |= 1<<(7-j);
        dataCodewords.push(b);
      }
      // Try all masks, pick best (lowest penalty) — simplified: just use mask 0
      return new QrCode(ver, 0, dataCodewords, 0);
    }
  }
  throw new Error('Data too long');
}

function appendBits(bb, val, len){
  for (var i=len-1;i>=0;i--) bb.push(((val>>>i)&1)!=0);
}

global.QR = {
  draw: function(canvas, text, opts){
    opts = opts || {};
    var scale = opts.scale || 8;
    var margin = opts.margin || 2;
    var dark = opts.dark || '#000';
    var light = opts.light || '#fff';
    var qr = encodeText(text);
    var size = qr.size + margin*2;
    canvas.width = size*scale;
    canvas.height = size*scale;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = light; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = dark;
    for (var y=0;y<qr.size;y++) for (var x=0;x<qr.size;x++){
      if (qr.modules[y][x]) ctx.fillRect((x+margin)*scale, (y+margin)*scale, scale, scale);
    }
  }
};
})(typeof window!=='undefined'?window:this);
