(() => {
  // src/game/engine/loader.js
  function Loader(images) {
    this.images = images;
    this.loaded = [];
    this.loadedImgs = 0;
    this.totalImgs = Object.keys(images).length;
    this.start = function() {
      const loader = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.loadImages(this.images);
      });
      return loader;
    };
    this.loadImages = function(i) {
      const append = "data:image/gif;base64,";
      for (let n in i) {
        if (i.hasOwnProperty(n)) {
          this.loaded[n] = new Image();
          this.loaded[n].onload = this.checkLoaded();
          this.loaded[n].src = append + i[n];
        }
      }
    };
    this.checkLoaded = function() {
      this.loadedImgs += 1;
      if (this.loadedImgs === this.totalImgs) {
        setTimeout(() => this.resolve(this.loaded), 500);
      }
    };
    this.makeFonts = function() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    };
  }

  // src/game/engine/canvas.js
  function Canvas(w, h) {
    this.w = w;
    this.h = h;
    this.c = document.getElementsByTagName("canvas")[0];
    this.ctx = this.c.getContext("2d");
    this.c.width = w;
    this.c.height = h;
    this.c.style.width = w + "px";
    this.c.style.height = h + "px";
    this.resize = function() {
      let gameArea = document.querySelector("canvas");
      const widthToHeight = this.w / this.h;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      const newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        this.c.style.height = newHeight + "px";
        this.c.style.width = newWidth + "px";
      } else {
        newHeight = newWidth / widthToHeight;
        this.c.style.width = newWidth + "px";
        this.c.style.height = newHeight + "px";
      }
      this.c.style.marginTop = -newHeight / 2 + "px";
      this.c.style.marginLeft = -newWidth / 2 + "px";
    };
    this._resize = function() {
      let winH = window.innerHeight, winW = window.innerWidth, ratio = this.w / this.h, w2 = winH * ratio, h2 = winW * ratio;
      this.c.width = this.w;
      this.c.height = this.h;
      this.cx = this.w / 2;
      this.cy = this.h / 2;
      this.c.style.width = ~~w2 + "px";
      this.c.style.height = ~~winH + "px";
    };
    this.delayedResize = function(delay = 100) {
      window.setTimeout(() => {
        this.resize();
      }, delay);
    };
    window.addEventListener("resize", () => {
      this.delayedResize();
    });
    window.addEventListener("fullscreenchange", () => {
      this.delayedResize(150);
    });
    this.delayedResize(500);
    return {
      c: this.c,
      ctx: this.ctx
    };
  }

  // src/game/engine/helpers.js
  var helpers_default = {
    timeStamp: function() {
      return window.performance && window.performance.now ? window.performance.now() : (/* @__PURE__ */ new Date()).getTime();
    },
    rnd: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    rndArray: function(a) {
      return a[~~(Math.random() * a.length)];
    },
    mkCanvas: function(w, h) {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      c.width = w;
      c.height = h;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      return c;
    },
    mkFont: function(g, size, col) {
      let font = g.draw.color(g.imgs["font_" + size], g.o.pal[col], true);
      font.scale = size;
      return font;
    },
    /*
    http://jsfiddle.net/jessefreeman/FJzcc/1/
    T: current Time
    B: start Value
    C: change in value
    D: duration
    */
    tween: function(t, b, c, d) {
      return c * t / d + b;
    }
  };

  // src/game/engine/draw.js
  var Draw = class {
    constructor(c, ctx, pal, isMobile = false) {
      this.pal = pal;
      this.c = c;
      this.ctx = ctx;
    }
    clear(colorKey) {
      let raw = this.pal[colorKey];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    }
    rect(x, y, w, h, colorKey, o2) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      let raw = this.pal[colorKey];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.fillRect(~~x, ~~y, w, h);
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    img(i, x, y, scale = false, o2 = false) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      if (scale) {
        i = this.resize(i, scale);
      }
      this.ctx.drawImage(i, ~~x, ~~y);
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    circle(x, y, r, col, o2 = false) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      let raw = this.pal[col];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.beginPath();
      this.ctx.arc(~~x + r, ~~y, ~~r, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    ring(x, y, r, col, w = 2, o2 = false) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      let raw = this.pal[col];
      this.ctx.strokeStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      this.ctx.lineWidth = w;
      this.ctx.beginPath();
      this.ctx.arc(~~x + r, ~~y, ~~r, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.stroke();
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    triangle(x, y, w, h, col, o2 = false) {
      if (o2) {
        this.ctx.globalAlpha = o2;
      }
      let raw = this.pal[col];
      this.ctx.fillStyle = `rgb(${raw[0]},${raw[1]},${raw[2]})`;
      const path = new Path2D();
      path.moveTo(x, y);
      path.lineTo(x + w / 2, y - h);
      path.lineTo(x + w, y);
      this.ctx.fill(path);
      if (o2) {
        this.ctx.globalAlpha = 1;
      }
    }
    flip(i, flipH, flipV) {
      let c = helpers_default.mkCanvas(i.width, i.height), ctx = c.getContext("2d"), scaleH = flipH ? -1 : 1, scaleV = flipV ? -1 : 1, posX = flipH ? i.width * -1 : 0, posY = flipV ? i.height * -1 : 0;
      c.width = i.width;
      c.height = i.height;
      ctx.save();
      ctx.scale(scaleH, scaleV);
      ctx.drawImage(i, posX, posY, i.width, i.height);
      ctx.restore();
      return c;
    }
    resize(i, factor) {
      let c = helpers_default.mkCanvas(i.width * factor, i.height * factor), ctx = c.getContext("2d");
      if (c.width) {
        ctx.save();
        ctx.scale(factor, factor);
        ctx.drawImage(i, 0, 0);
        ctx.restore();
      }
      c.scale = factor;
      return c;
    }
    color(i, col) {
      const c = helpers_default.mkCanvas(i.width, i.height), ctx = c.getContext("2d");
      let p = 0, imageData;
      ctx.drawImage(i, 0, 0);
      imageData = ctx.getImageData(0, 0, i.width, i.height);
      for (p = 0; p < imageData.data.length; p += 4) {
        imageData.data[p + 0] = col[0];
        imageData.data[p + 1] = col[1];
        imageData.data[p + 2] = col[2];
      }
      ctx.putImageData(imageData, 0, 0);
      return c;
    }
    textWidth(s, f) {
      return s.length * (3 * f.scale) + s.length * (1 * f.scale);
    }
    text(s, f, x, y) {
      let i = 0, ctx = this.ctx, firstChar = 65, offset = 0, w = 3 * f.scale, h = 5 * f.scale, spacing = 1 * f.scale, sW = this.textWidth(s, f), charPos = 0;
      const nums = "0123456789".split("");
      if (typeof s === "number" || s[0] === "0") {
        s += "";
        offset = 43;
      }
      x = x || (this.c.width - sW) / 2;
      for (i = 0; i < s.length; i += 1) {
        if (typeof s[i] === "number" || s[i] === "0" || nums.indexOf(s[i]) !== -1) {
          offset = 43;
        } else {
          offset = 0;
        }
        charPos = (s.charCodeAt(i) - firstChar + offset) * (w + spacing);
        if (s[i] === "?") {
          charPos = 144;
        }
        if (s[i] === ":") {
          charPos = 148;
        }
        if (s[i] === "%") {
          charPos = 152;
        }
        if (charPos > -1) {
          ctx.drawImage(
            f,
            charPos,
            0,
            w,
            h,
            ~~x,
            ~~y,
            w,
            h
          );
        }
        x += w + spacing;
      }
    }
  };

  // src/game/engine/input.js
  function Input(canvas, g) {
    let l = window.addEventListener;
    let s = this;
    this.c = canvas;
    this.g = g;
    this.click = 0;
    this.keys = { l: 0, r: 0 };
    this.resetKeys = () => {
      this.keys = { l: 0, r: 0, click: false };
    };
    l("keydown", (e) => {
      switch (e.keyCode) {
        case 39:
          this.keys.r = 1;
          break;
        case 37:
          this.keys.l = 1;
          break;
      }
      this.click = true;
    });
    l("keyup", (e) => {
      switch (e.keyCode) {
        case 39:
          this.keys.r = 0;
          break;
        case 37:
          this.keys.l = 0;
          break;
      }
      this.click = false;
    });
    l("touchstart", (e) => {
      this.trackTouch(e.touches);
    });
    l("touchmove", (e) => {
      this.trackTouch(e.touches);
    });
    l("touchend", (e) => {
      this.trackTouch(e.touches);
      this.resetKeys();
    });
    this.trackTouch = (touches) => {
      let c = this.c, offsetX = c.offsetLeft, scale = parseInt(c.style.width, 10) / c.width;
      if (!touches || !touches[0])
        return;
      const x = ~~(touches[0].pageX - offsetX) / scale;
      this.click = true;
      if (x < c.width / 2) {
        this.keys.l = 1;
      } else {
        this.keys.r = 1;
      }
    };
  }

  // src/game/engine/game.js
  function Game(o2 = {}) {
    const defaults = {
      w: 320,
      h: 480,
      orientation: "portrait"
    };
    let ua = navigator.userAgent.toLowerCase();
    this.android = ua.indexOf("android") > -1;
    this.ios = /ipad|iphone|ipod/.test(ua);
    this.mobile = this.android || this.ios;
    this.firefox = ua.indexOf("firefox") > -1;
    this.chrome = ua.indexOf("chrome") > -1;
    this.chromobile = this.mobile && this.chrome;
    for (let n in defaults) {
      this[n] = defaults[n];
    }
    this.o = Object.assign(defaults, o2);
    this.data = o2;
    this.dt = 0;
    this.fps = 60;
    this.frameStep = 1 / this.fps;
    this.frameCurr = 0;
    this.framePrev = helpers_default.timeStamp();
    this.stateName = o2.start;
    this.H = helpers_default;
    this.states = o2.states;
    this.availEnts = o2.ents;
    this.score = 0;
    this.hiScore = 20;
    this.plays = 0;
    this.ents = [];
    this.imgs = [];
    this.fonts = [];
    this.events = [];
    this.transition = false;
    this.H = helpers_default;
    this.Sfx = o2.Sfx;
    window.G = this;
    this.init = function() {
      const loader = new Loader(this.o.i);
      document.title = this.o.title;
      this.canvas = new Canvas(this.o.w, this.o.h);
      this.draw = new Draw(this.canvas.c, this.canvas.ctx, this.o.pal, this.mobile);
      this.input = new Input(this.canvas.c, this.g);
      this.viewport = {
        w: this.w,
        h: this.h,
        world: {
          h: this.h,
          w: this.w
        },
        x: 0,
        y: 0,
        maxY: 0,
        init: function(h) {
          this.world.h = h;
          this.maxY = h - this.h;
          this.y = 0;
        },
        convY: function(y) {
          return ~~(this.h - y);
        },
        move: function(dir) {
          this.y += dir;
          if (this.y < 0)
            this.y = 0;
          if (this.y > this.maxY)
            this.y = this.maxY;
        }
      };
      loader.start().then((res) => {
        this.imgs = res;
        this.makeFonts(this.imgs.font);
        document.getElementById("l").style.display = "none";
        this.changeState(this.stateName);
        this.canvas.c.style.display = "block";
        this.favIcon(this.draw.resize(this.imgs.cat, 8));
        this.loop();
      });
    };
    this.makeFonts = function(f) {
      let i = 12;
      while (i-- > 1) {
        this.imgs["font_" + i] = this.draw.resize(f, i);
      }
    };
    this.favIcon = function(i) {
      let c = document.createElement("canvas"), ctx = c.getContext("2d"), l = document.createElement("link");
      c.width = c.height = 64;
      ctx.drawImage(i, 0, 0);
      l.type = "image/x-icon";
      l.rel = "shortcut icon";
      l.href = c.toDataURL("image/x-icon");
      document.getElementsByTagName("head")[0].appendChild(l);
    };
    this.sfxPlay = function(key) {
      if (this.ios)
        return;
      this.Sfx(...this.data.sfx[key]);
    };
    this.changeState = function(state) {
      this.ents = [];
      this.events = [];
      this.state = new this.states[state](this);
      this.input.resetKeys();
      this.state.init();
      this.transition = false;
    };
    this.loop = function() {
      this.frameCurr = helpers_default.timeStamp();
      this.dt = this.dt + Math.min(1, (this.frameCurr - this.framePrev) / 1e3);
      while (this.dt > this.frameStep) {
        this.dt = this.dt - this.frameStep;
        this.update(this.frameStep);
      }
      this.render(this.dt);
      this.framePrev = this.frameCurr;
      requestAnimationFrame(() => this.loop());
    };
    this.update = function(step) {
      this.fader = Math.sin((/* @__PURE__ */ new Date()).getTime() * 5e-3);
      this.runEvents(step);
      this.state.update(step);
      let i = this.ents.length;
      while (i--) {
        if (this.ents[i].remove) {
          this.ents.splice(i, 1);
        }
      }
      this.state.update(step);
    };
    this.render = function(step) {
      this.state.render(step);
    };
    this.spawn = function(ent, opts) {
      const sprite = new this.availEnts[ent](this, opts);
      this.ents.push(sprite);
      return sprite;
    };
    this.burst = function(x, y, col, num, w = 3) {
      while (num--) {
        this.ents.push(new this.availEnts.Particle(this, {
          x,
          y,
          col,
          w
        }));
      }
    };
    this.addEvent = function(e) {
      this.events.push(e);
    };
    this.runEvents = function(step) {
      this.events.forEach((e, i) => {
        e.t -= step * 100;
        if (e.t < 0) {
          e.cb.call(this);
          this.events.splice(i, 1);
        }
      });
    };
    return this;
  }

  // src/game/data/images.js
  var images_default = { "bat": "R0lGODlhEAAIAKEDAAAAAC9ITvfia+BviyH5BAEKAAMALAAAAAAQAAgAAAIdnI95YawZomt0ACBCvk2eKwFHliEX93mmuKLPehQAOw==", "biter": "R0lGODlhDgAIAKECAL4mM////+Bvi+BviyH5BAEKAAIALAAAAAAOAAgAAAIYVH6iq+j2HACuolkxtEebH2wIQ1bNIwoFADs=", "brick1": "R0lGODlhCAAHAIABAAAAAOBviyH5BAEKAAEALAAAAAAIAAcAAAINhBEZh8rL2lFpQlpbKgA7", "brick2": "R0lGODlhBgAIAIABAAAAAOBviyH5BAEKAAEALAAAAAAGAAgAAAIMDIJ4tgp/4EswWWoLADs=", "broom": "R0lGODlhDAADAKECAKRkIuuJMeBvi+BviyH5BAEKAAIALAAAAAAMAAMAAAIKVC6peeAPDVqqAAA7", "bubble": "R0lGODlhBgAGAIABAP///+BviyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAGAAYAAAIKTAB2lqmolnPHFQA7", "cat": "R0lGODlhCAAGAKECAKPOJ////+Bvi+BviyH5BAEKAAIALAAAAAAIAAYAAAIOlGOCF90HGlDKLftOCgUAOw==", "cat1": "R0lGODlhCAAGAKECABsmMqPOJ+Bvi+BviyH5BAEKAAIALAAAAAAIAAYAAAIOlGGCB90XWlDKLftOAgUAOw==", "cat2": "R0lGODlhCAAGAKECAOuJMaPOJ+Bvi+BviyH5BAEKAAIALAAAAAAIAAYAAAIOlGGCB90XWlDKLftOAgUAOw==", "circle": "R0lGODlhCAAIAIABAP///zGi8iH5BAEKAAEALAAAAAAIAAgAAAIMTIBgl8gNo5wvrWYKADs=", "demon": "R0lGODlhEAAIAKEDAAAAAL4mM////+BviyH5BAEKAAMALAAAAAAQAAgAAAIf1I5ieLrtmBqTrjqD3rxvAGigGAajh3ZHug0B87pqAQA7", "door": "R0lGODlhCQAOAKECAAAAABsmMuBvi+BviyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAJAA4AAAIXDI5gyRq/DnxpRgfr1BlZTnmb2Emj2RUAOw==", "dot": "R0lGODlhAQABAIABAP///zGi8iH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==", "fireball": "R0lGODlhCAAFAMIEAL4mM+uJMffia////+Bvi+Bvi+Bvi+BviyH5BAEKAAQALAAAAAAIAAUAAAMOSErQy0GMRqMArAasKE4AOw==", "firefly": "R0lGODlhCAAEAKEDAESJGqPOJ/fia+BviyH5BAEKAAMALAAAAAAIAAQAAAIN1BZwwpHAhnAAnpNuAQA7", "font": "R0lGODlhmwAFAIABAAAAADGi8iH5BAEKAAEALAAAAACbAAUAAAJ4hGOAd6sZFpowPhrxhZz5x2ji5pRTyVEfulaWRV6vfNayksV5O/b53NMBcbjX0JY50pYwkFHDAxGTTlsUpZIadRViYzo1tVazcfHHRSOVWx9UyKK2wym6+nRei47AtkTbAbgTc1X3VvOXtfXFhkfmpVUWqeiSZFkAADs=", "heart": "R0lGODlhBQAFAIABAL4mMzGi8iH5BAEKAAEALAAAAAAFAAUAAAIIDGygu3mBQgEAOw==", "skull": "R0lGODlhBQAEAIABAP///+BviyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAFAAQAAAIGhB+QZ+kFADs=", "spark": "R0lGODlhAwADAIABAP///+BviyH5BAEKAAEALAAAAAADAAMAAAIEDAx3BQA7", "spider": "R0lGODlhBwAEAKECAAAAAL4mM+Bvi+BviyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAIALAAAAAAHAAQAAAIKFH4iAQyK0pumAAA7", "spike": "R0lGODlhBgAIAKEDAEk8K52dnf///+BviyH5BAEKAAMALAAAAAAGAAgAAAIPBIYTIckCxQrJJMVchDMVADs=", "spitter": "R0lGODlhBAAHAKEAAOBvi52dnf///+BviyH5BAEKAAMALAAAAAAEAAcAAAIKVDZ2ChqGYAqnAAA7", "torch": "R0lGODlhAwALAMIEAEk8K74mM6RkIvfia+Bvi+Bvi+Bvi+BviyH5BAEKAAQALAAAAAADAAsAAAMOSBS7HDCMpxQQgGRtSQIAOw==", "witch": "R0lGODlhDwAIAKEDAESJGqPOJ////+BviyH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAMALAAAAAAPAAgAAAIanI+py+0BApRyTGhrDoYaAX7hAArkSKapmRQAOw==" };

  // src/game/data/sfx.js
  var sfx_default = {
    hit: [, , 537, 0.02, 0.02, 0.22, 1, 1.59, -6.98, 4.97],
    piano: [0.9, 0.8, 270, , 0.1, , 1, 1.5, , , , , , , , 0.1, 0.01],
    jump: [0.1, , 921, 0.04, 0.03, 0.52, , 2.44, , 0.5, , , 0.05, 1.4, 57, 0.9, , 0.33, 0.18, 0.47],
    land: [, , 129, 0.01, , 0.15, , , , , , , , 5],
    thunder: [1, , 979, 0.01, 0.02, 0.52, 1, 2.52, 0.5, 0.7, , , 0.02, 1.2, 7, 0.2, 0.13, 0.48, 0.01, 0.44],
    fin: [0.5, , 925, 0.04, 0.3, 0.6, 1, 0.3, , 6.27, -184, 0.09, 0.17],
    speak: [, , 1236, 0.01, 0.01, 0.02, 1, 0.13, , -6.5, , , , 0.2, , , , 0.14, 0.02, 0.25],
    win: [1.06, , 299, , 0.3, 0.23, , 0.04, -2.6, 4.3, , , 0.19, , , , , 0.74, 0.17, 0.4],
    gameover: [1.04, , 612, 0.01, 0.17, 0.41, , 0.3, , , , , 0.17, , , 0.2, , 0.62, 0.25, 0.27]
  };

  // src/game/data/base.js
  var base_default = {
    title: "BEWITCHED!",
    start: "Ready",
    gravity: 9.8,
    w: 320,
    h: 480,
    pal: [
      // AndroidArts16 - https://androidarts.com/palette/16pal.htm
      [0, 0, 0],
      // 0 void
      [157, 157, 157],
      // 1 ash
      [255, 255, 255],
      // 2 white
      [190, 38, 51],
      // 3 bloodred
      [224, 111, 139],
      // 4 pigmeat
      [73, 60, 43],
      // 5 oldpoop
      [164, 100, 34],
      // 6 newpoop
      [235, 137, 49],
      // 7 orange
      [247, 226, 107],
      // 8 yellow
      [42, 72, 78],
      // 9 darkgreen
      [68, 137, 26],
      // 10 green
      [163, 206, 39],
      // 11 slimegreen
      [27, 38, 50],
      // 12 nightblue
      [0, 87, 132],
      // 13 seablue
      [49, 162, 242],
      // 14 skyblue
      [178, 220, 239],
      // 15 cloudblue
      [40, 30, 40],
      // 16 plum
      [30, 40, 30],
      // 17 dgreen
      [44, 34, 28],
      // 18 charcoal PICO8
      [122, 50, 46],
      // 19 leather PICO8
      [44, 44, 44]
      // 20 dark
    ],
    i: images_default,
    sfx: sfx_default
  };

  // src/game/states/ready.js
  var Ready = class {
    constructor(g) {
      this.g = g;
      this.mainText = g.H.mkFont(g, 4, 11);
      this.text = g.mobile ? "TAP ME" : "PRESS A KEY";
    }
    init() {
    }
    update(dt) {
      if (this.g.input.click) {
        this.g.changeState("Title");
      }
    }
    render() {
      const g = this.g;
      g.draw.clear(0);
      if (g.fader > 0) {
        g.draw.text(this.text, this.mainText, false, 120);
      }
    }
  };

  // src/game/states/title.js
  var Title = class {
    constructor(g) {
      this.g = g;
      this.bat = this.g.spawn("Bat", { p: this, x: 100, y: 440, s: 2 });
      this.bat = this.g.spawn("Bat", { p: this, x: 200, y: 200 });
      this.mainText = g.H.mkFont(g, 6, 11);
      this.mainShadow = g.H.mkFont(g, 6, 0);
      this.startText = g.H.mkFont(g, 2, 2);
      this.canSwitch = false;
      this.text = g.mobile ? "TAP TO START" : "L OR R ARROW TO START";
      this.bga = 0;
    }
    init() {
      this.setThunder();
      this.g.addEvent({
        t: 75,
        cb: () => {
          this.canSwitch = true;
        }
      });
    }
    setThunder() {
      this.g.addEvent({
        t: this.g.H.rnd(200, 500),
        cb: () => {
          this.bga = 1;
          this.g.sfxPlay("thunder");
          this.setThunder();
        }
      });
    }
    update(dt) {
      const g = this.g;
      g.ents.forEach((e) => {
        e.update(dt);
      });
      if (this.bga > 0) {
        this.bga -= dt;
      }
      if (this.bga < 0) {
        this.bga = 0;
      }
      const i = g.input;
      if (i.click && this.canSwitch) {
        g.changeState("Play");
      }
      i.click = false;
    }
    render() {
      const g = this.g;
      g.draw.clear(12);
      if (this.bga) {
        g.draw.rect(0, 0, g.w, g.h, 2, this.bga);
      }
      g.draw.circle(230, 70, 40, 2);
      this.drawTower();
      g.draw.rect(0, g.h - 10, g.w, g.h, 3);
      g.draw.text(g.data.title, this.mainShadow, false, 156);
      g.draw.text(g.data.title, this.mainText, false, 150);
      this.g.ents.forEach((e) => {
        e.render();
      });
      g.draw.triangle(90, 70, 100, 50, 19);
      g.draw.triangle(90, 70, 100, 50, 0, 0.1);
      if (g.fader > 0) {
        g.draw.text(this.text, this.startText, false, 400);
      }
    }
    drawTower() {
      const g = this.g;
      g.draw.rect(90, 70, 100, g.h, 19);
      g.draw.rect(120, g.h - 40, 20, g.h, 0);
      g.draw.img(g.imgs.brick1, 100, 100, 8, 0.1);
      g.draw.img(g.imgs.brick1, 142, g.h / 2, 6, 0.1);
      g.draw.img(g.imgs.brick2, g.w / 3, g.h / 3, 10, 0.1);
      g.draw.img(g.imgs.brick2, g.w / 3, 300, 10, 0.1);
    }
  };

  // src/game/data/levels.json
  var levels_default = {
    "0": {
      n: "TUTORIAL",
      h: 1,
      bg: 20,
      l: 6,
      data: [
        "B-100-280",
        "L-0-50-320",
        "L-0-200-30",
        "L-290-200-30",
        "L-140-350-50-0-0-0-7"
      ]
    },
    "1": {
      n: "BELFRY",
      h: 3,
      bg: 12,
      l: 14,
      data: [
        "B-100-280",
        "L-110-50-100",
        "L-0-200-30",
        "L-290-200-30",
        "L-140-350-50-1",
        "B-250-600",
        "L-140-700-50",
        "L-0-900-30",
        "L-290-750-30",
        "B-250-900",
        "L-0-1100-30-0-1",
        "L-290-1100-30-0-1",
        "L-140-1300-50-0-0-0-7"
      ]
    },
    "2": {
      n: "INFESTATION",
      h: 4,
      bg: 18,
      l: 7,
      data: [
        "L-110-50-100",
        "L-100-350-150-0-0-0-1",
        "L-290-500-30-0-1",
        "L-0-500-30-0-1",
        "B-100-500",
        "L-80-700-50-0-0-0-1",
        "L-200-700-50-0-0-0-1",
        "L-20-900-30-0-0-0-1",
        "L-270-900-30-0-0-0-1",
        "B-100-1000",
        "L-100-1200-100-1",
        "L-145-1450-30-0-1",
        "B-100-1500",
        "L-20-1650-30-0-0-0-1",
        "L-270-1650-30-0-0-0-1",
        "L-120-1750-50-0-0-0-7"
      ]
    },
    "3": {
      n: "MUNCHFEST",
      h: 5,
      bg: 16,
      l: 4,
      data: [
        "L-110-50-100",
        "L-100-350-150-0-0-0-2",
        "L-0-600-50-0-0-0-2",
        "L-270-600-50-0-0-0-2",
        "L-100-700-150-0-0-0-3",
        "L-100-1000-150-1",
        "B-100-1200",
        "L-100-1400-150-1",
        "B-100-1600",
        "L-100-1800-150-1",
        "L-120-2300-50-0-0-0-7"
      ]
    },
    "4": {
      n: "INFERNO",
      h: 5,
      bg: 17,
      l: 8,
      data: [
        "L-110-50-100",
        "L-110-250-100-0-1",
        "S-0-300",
        "S-1-300",
        "L-0-700-50-1",
        "S-0-800",
        "S-1-800",
        "L-0-1000-50-0-0-0-3",
        "L-270-1000-50",
        "S-0-1200",
        "S-1-1200",
        "L-270-1300-50",
        "L-0-1400-50",
        "L-110-1600-100-0-0-0-3",
        "S-0-1700",
        "S-1-1700",
        "L-270-1800-50",
        "L-0-2000-50",
        "S-0-2150",
        "S-1-2150",
        "L-120-2300-50-0-0-0-7"
      ]
    },
    "5": {
      n: "YE OLDE DEATHE",
      h: 6,
      bg: 19,
      l: 12,
      data: [
        "L-110-50-100",
        "L-110-250-100-1-1",
        "S-0-200",
        "S-1-200",
        "X-0-300",
        "X-1-300",
        "X-0-350",
        "X-1-350",
        "B-100-375",
        "X-0-400",
        "X-1-400",
        "X-0-450",
        "X-1-450",
        "L-110-600-100-0-0-0-1",
        "L-0-800-100-0-0-0-2",
        "L-220-800-100-0-0-0-2",
        "L-110-1000-100",
        "S-0-1000",
        "S-1-1000",
        "X-0-1200",
        "X-1-1200",
        "L-110-1350-100-1-1",
        "S-0-1500",
        "S-1-1500",
        "B-100-1550",
        "S-0-1600",
        "S-1-1600",
        "L-110-1800-100",
        "X-0-2000",
        "X-1-2000",
        "L-0-2050-50",
        "L-270-2050-50",
        "X-0-2060",
        "X-1-2060",
        "L-110-2300-100-1-0",
        "L-110-2400-100-0-1",
        "B-0-2550",
        "B-280-2550",
        "L-120-2700-50-0-0-0-7"
      ]
    }
  };

  // src/game/ents/tower.js
  var Tower = class {
    constructor(p) {
      this.level = 1;
      this.p = p;
      this.g = p.g;
    }
    init(level) {
      this.level = level;
      const pad_array = function(arr, len, fill) {
        return arr.concat(Array(len).fill(fill)).slice(0, len);
      };
      this.fin = false;
      let d = levels_default[level];
      if (!d) {
        this.complete = true;
        return;
      }
      this.n = d.n;
      this.bg = d.bg;
      this.h = d.h * this.g.h;
      d.data.forEach((line) => {
        let p = line.split("-");
        p.forEach((v, i) => {
          if (i) {
            p[i] = ~~v;
          }
        });
        switch (p[0]) {
          case "B":
            this.g.spawn("Bat", { p: this.p, x: ~~p[1], y: ~~p[2] });
            break;
          case "S":
            this.g.spawn("Spitter", { p: this.p, x: ~~p[1], y: ~~p[2] });
            break;
          case "X":
            this.g.spawn("Spike", { p: this.p, x: ~~p[1], y: ~~p[2] });
            break;
          case "L":
            p = pad_array(p, 10, 0);
            let l = {
              p: this.p,
              x: p[1],
              y: p[2],
              w: p[3],
              vx: p[4],
              vy: p[5],
              col: p[6] || d.l,
              b: p[7]
            };
            this.g.spawn("Ledge", l);
            break;
          default:
            break;
        }
      });
    }
  };

  // src/game/states/play.js
  var Play = class {
    constructor(g) {
      this.g = g;
      window.P = this;
      this.tower = {
        fin: false,
        h: this.g.h * 3,
        bg: 12
      };
      this.mainText = g.H.mkFont(g, 3, 11);
      this.curtain = {
        active: false,
        h: 0
      };
      this.g.plays += 1;
    }
    init() {
      this.tower = new Tower(this);
      this.sess = {
        level: this.g.plays < 2 ? 0 : 1,
        score: 0,
        time: 0,
        lives: 2,
        gameOver: false
      };
      this.nextLevel();
    }
    nextLevel() {
      let gw = this.g.w;
      this.g.ents = [];
      this.g.events = [];
      this.bgBlocks = [];
      this.tower.init(this.sess.level);
      if (this.tower.complete) {
        this.g.changeState("Win");
        return;
      }
      let startX = 200;
      let maxX = ~~(this.tower.h / startX);
      let o2 = 0.1;
      for (let n = 1; n < maxX; n += 1) {
        let i = Math.random() > 0.5 ? 1 : 2;
        this.bgBlocks.push(["brick" + i, -20, startX * n + 20, 16, o2]);
        this.bgBlocks.push(["brick" + i, 240, startX * n + 20, 16, o2]);
        if (n % 2 !== 0)
          this.bgBlocks.push(["brick" + i, gw / 2, startX * n + 20, 5, o2]);
      }
      this.door = this.g.spawn("Door", { p: this });
      this.p1 = this.g.spawn("Witch", { p: this });
      this.g.viewport.init(this.tower.h);
      this.g.viewport.y = this.tower.h - this.g.h;
      if (this.sess.level === 0 && this.sess.lives === 2) {
        this.helpText();
      } else if (this.sess.level > 0) {
        this.addText("LEVEL " + this.sess.level, 50, false, 300, 11, 4);
        this.addText(this.tower.n, 100, false, 340, 11, 4);
      }
    }
    update(dt) {
      if (!this.door.open && this.cat.owner) {
        this.door.open = true;
      }
      if (this.curtain.active && this.curtain.h < this.g.h) {
        this.curtain.h += 10;
      } else if (this.curtain.h > 0) {
        this.curtain.h -= 15;
      }
      this.g.ents.forEach((e) => {
        e.update(dt);
      });
    }
    render() {
      const g = this.g;
      g.draw.clear(this.tower.bg);
      const cy = this.convertY.bind(this);
      const convY = this.g.viewport.convY.bind(this.g.viewport);
      g.draw.rect(0, cy(18), g.w, 50, 3);
      g.draw.rect(0, cy(18), g.w, 2, 0, 0.3);
      this.bgBlocks.forEach((e) => {
        let y = cy(e[2]), h = g.imgs[e[0]].height * e[3];
        let onScreen = g.viewport.y < y + h || g.viewport.y > y + h;
        if (onScreen && !g.android) {
          g.draw.img(g.imgs[e[0]], e[1], y, e[3], e[4]);
        }
      });
      this.g.ents.forEach((e) => {
        e.render();
      });
      if (this.p1) {
        g.draw.rect(18, 16, this.p1.maxCharge + 4, 14, 0);
        g.draw.rect(20, 18, this.p1.charge, 10, 11);
        g.draw.rect(20, 18, this.p1.charge, 4, 2, 0.3);
      }
      let lives = this.sess.lives;
      while (lives--) {
        g.draw.img(g.imgs.heart, 300 - lives * 20, 20, 2);
      }
      if (this.curtain.h > 0) {
        g.draw.rect(0, 0, g.w, this.curtain.h, 0);
      }
      if (this.curtain.active && this.curtain.h >= g.h) {
        this.sess.level += 1;
        this.nextLevel();
        this.curtain.active = false;
      }
    }
    convertY(y) {
      return this.g.h - y + this.g.viewport.y;
    }
    levelComplete() {
      if (!this.tower.fin) {
        this.tower.fin = true;
        this.g.sfxPlay("piano");
        this.curtain.active = true;
      }
    }
    helpText() {
      let textL = "HOLD LEFT ARROW";
      let textR = "HOLD RIGHT ARROW";
      if (this.g.mobile) {
        textL = textR = "HOLD HERE";
      }
      this.addText(textL, 50, 10, 310);
      this.addText("TO FLY LEFT", 50, 10, 330);
      this.addText(textR, 400, 180, 310);
      this.addText("TO FLY RIGHT", 400, 180, 330);
      this.addText("NOW RESCUE CAT", 770, false, 100, 7, 4);
    }
    addText(text, delay, x = 10, y = 310, col = 1, scale = 2) {
      this.g.addEvent({
        t: delay,
        cb: () => {
          this.g.spawn("Text", { x, y, text, col, o: 5, scale });
        }
      });
    }
  };

  // src/game/states/gameover.js
  var Gameover = class {
    constructor(g) {
      this.g = g;
      this.mainText = g.H.mkFont(g, 6, 2);
      this.canSwitch = false;
      this.o = 0;
    }
    init() {
      this.g.addEvent({
        t: 100,
        cb: () => {
          this.canSwitch = true;
          this.g.sfxPlay("gameover");
        }
      });
    }
    update(dt) {
      if (this.o < 0.5) {
        this.o += dt / 10;
      }
      this.g.ents.forEach((e) => {
        e.update(dt);
      });
      if (this.g.input.click && this.canSwitch) {
        this.g.changeState("Title");
      }
    }
    render() {
      const g = this.g;
      g.draw.clear(3);
      g.draw.rect(0, 0, g.w, g.h, 0, this.o);
      if (g.fader > 0) {
        g.draw.text("GAME", this.mainText, false, 100);
        g.draw.text("OVER", this.mainText, false, 150);
      }
      g.draw.img(g.imgs.skull, 120, 240, 14, 0.2);
      this.g.ents.forEach((e) => {
        e.render();
      });
    }
  };

  // src/game/states/win.js
  var Win = class {
    constructor(g) {
      this.g = g;
      this.mainText = g.H.mkFont(g, 7, 2);
      this.canSwitch = false;
      this.o = 0;
      this.cat2 = g.draw.flip(g.imgs.cat1, 1, 0);
    }
    init() {
      this.g.sfxPlay("win");
      this.confetti();
      this.g.addEvent({
        t: 500,
        cb: () => {
          this.canSwitch = true;
        }
      });
      this.g.addEvent({
        t: 100,
        cb: () => {
          this.g.spawn("Text", { text: "YAYYY", x: 20, y: 350, col: 2, scale: 3, o: 4 });
          this.g.sfxPlay("speak");
        }
      });
      this.g.addEvent({
        t: 200,
        cb: () => {
          this.g.spawn("Text", { text: "YOU AWESOME", x: 180, y: 350, col: 12, scale: 3, o: 4 });
          this.g.sfxPlay("speak");
        }
      });
    }
    confetti() {
      this.g.addEvent({
        t: this.g.H.rnd(100, 300),
        cb: () => {
          let x = this.g.H.rnd(50, this.g.w - 50), y = this.g.H.rnd(100, this.g.h - 100);
          this.g.burst(x, y, 4, 5, 4);
          this.g.sfxPlay("jump");
          this.confetti();
        }
      });
    }
    update(dt) {
      if (this.o < 0.5) {
        this.o += dt / 10;
      }
      this.g.ents.forEach((e) => {
        e.update(dt);
      });
      if (this.g.input.click && this.canSwitch) {
        this.g.changeState("Title");
      }
    }
    render() {
      const g = this.g;
      g.draw.clear(14);
      g.draw.rect(0, 430, g.w, g.h, 11);
      g.draw.text("YOU", this.mainText, false, 70);
      g.draw.text("WIN", this.mainText, false, 120);
      g.draw.img(g.imgs.cat, 20, 400, 5);
      g.draw.img(this.cat2, 250, 400, 5);
      this.g.ents.forEach((e) => {
        e.render();
      });
    }
  };

  // src/game/ents/sprite.js
  var Sprite = class {
    constructor(g, o2) {
      this.g = g;
      this.o = o2;
      this.id = `id-${Math.random().toString(36).substr(2, 16)}`;
      this.dead = false;
      this.remove = false;
      this.offsetY = 0;
      this.name = o2.i;
      this.vx = 0;
      this.vy = 0;
      for (let n in o2) {
        this[n] = o2[n];
      }
      this.lastPos = { x: this.x, y: this.y };
      this.flip = { x: 0, y: 0 };
      this.scale = o2.scale || 1;
      this.frame = o2.frame || 1;
      this.frames = o2.frames || 1;
      this.frameRate = o2.frameRate || 80;
      this.frameNext = o2.frameNext || 0;
      if (o2.i) {
        this.mkImg(o2.i);
      }
      this.hurt = false;
      this.anims = { idle: { frames: [1], rate: 80 } };
      this.changeAnim("idle");
    }
    update(dt) {
      this.lastPos = { x: this.x, y: this.y };
      if (this.collidesWith) {
        this.collidesWith.forEach((group) => {
          this.hitGroup(group);
        });
      }
      this.updateAnim(dt);
    }
    render() {
      let g = this.g, i = this.hurt ? this.iHurt : this.i, frame = this.frame;
      if (this.g.viewport) {
        let onScreen = this.hit(this.g.viewport);
        if (!onScreen) {
          return;
        }
      }
      let x = ~~this.x;
      let y = ~~this.y;
      if (this.g.viewport) {
        y = this.convY();
      }
      if (i) {
        if (this.flip.y) {
          i = g.draw.flip(i, 0, 1);
        }
        if (this.flip.x) {
          i = g.draw.flip(i, 1, 0);
          frame = this.frames - this.frame + 1;
        }
        g.draw.ctx.drawImage(
          i,
          frame * this.w - this.w,
          0,
          this.w,
          this.h,
          ~~this.x,
          y + this.offsetY,
          this.w,
          this.h
        );
      } else {
        g.draw.rect(this.x, y, this.w, this.h, this.col);
      }
    }
    convY(y = this.y) {
      return this.g.viewport.convY(y) + this.g.viewport.y;
    }
    updateAnim(step) {
      if (this.frameNext < 0) {
        this.frameNext = this.anim.rate;
        this.anim.counter += 1;
        if (this.anim.counter >= this.anim.frames.length) {
          if (this.anim.next) {
            this.changeAnim(this.anim.next);
          } else {
            this.anim.counter = 0;
          }
        }
        this.frame = this.anim.frames[this.anim.counter];
      }
      this.frameNext -= step;
    }
    hitGroup(group) {
      this.g.ents.forEach((e) => {
        if (e && e.group === group && e.id !== this.id && this.hit(e)) {
          this.receiveDamage(e);
          e.doDamage(this);
        }
      });
    }
    hit(o2) {
      return !(o2.y + o2.h < this.y || o2.y > this.y + this.h || o2.x + o2.w < this.x || o2.x > this.x + this.w);
    }
    receiveDamage(o2) {
    }
    doDamage(o2) {
    }
    kill() {
      this.dead = this.remove = true;
    }
    mkImg(name) {
      if (!this.i) {
        return;
      }
      let g = this.g;
      this.i = g.draw.resize(g.imgs[name], this.scale);
      this.w = this.i.width / this.frames;
      this.h = this.i.height;
      this.iHurt = g.draw.color(this.i, g.data.pal[3]);
    }
    changeAnim(name) {
      if (this.anim && this.anim.name && this.anim.name === name) {
        return;
      }
      this.anim = this.anims[name];
      this.anim.name = name;
      this.anim.counter = 0;
      this.frame = this.anim.frames[0];
      this.frameNext = this.anim.rate;
    }
  };

  // src/game/ents/witch.js
  var Witch = class extends Sprite {
    constructor(g, o2) {
      o2.group = "player";
      o2.i = "witch";
      o2.collidesWith = ["baddies", "firefly", "cat", "door"];
      o2.scale = 3;
      o2.frames = 3;
      super(g, o2);
      this.g = g;
      this.o = o2;
      this.anims = {
        fly: { frames: [3], rate: 0.025 },
        stand: { frames: [2, 2, 2, 1], rate: 0.3 }
      };
      this.changeAnim("stand");
      this.gravity = g.data.gravity;
      this.maxCharge = 100;
      this.chargeRate = 2;
      this.charge = this.maxCharge;
      this.vx = 2;
      this.maxVy = 2;
      this.minVy = 3;
      this.hide = true;
      this.broom = g.draw.resize(g.imgs.broom, this.scale);
      this.broom2 = g.draw.flip(this.broom, 1, 0);
      this.hairColor = g.H.rndArray([2, 8, 4, 15, 7]);
      window.W = this;
      this.reset();
    }
    reset() {
      if (!this.hide)
        return;
      const g = this.g;
      this.vy = 0;
      this.x = g.w / 2;
      this.g.viewport.y = 0;
      this.y = this.convY(this.g.h - 50);
      this.isStanding = false;
      this.flip.y = 0;
      this.dead = false;
      this.hide = false;
      this.falling = false;
      this.hair = [];
      let i = 6;
      while (i) {
        this.hair.push({ x: this.x, y: this.y, s: i });
        i--;
      }
    }
    update(dt) {
      super.update(dt);
      this.isStanding = false;
      this.ledge = false;
      let g = this.g, k = g.input.keys, boost = k.click;
      boost = (k.l || k.r) && this.charge > 0;
      this.vy -= this.gravity / 4 * dt;
      if (this.falling || this.y < this.h) {
        this.y = ~~(this.y + this.vy);
        if (this.y - this.h < this.g.viewport.y && !this.dead) {
          this.kill();
        }
        return;
      }
      if (this.vy > this.maxVy)
        this.vy = this.maxVy;
      if (this.vy < -this.minVy)
        this.vy = -this.minVy;
      this.checkStanding();
      this.bindToScreen();
      this.handleInput(boost, k.l, k.r);
      this.y = ~~(this.y + this.vy);
      if (this.ledge && this.ledge.vx) {
        this.x += this.ledge.vx;
      }
      if (this.isStanding) {
        this.changeAnim("stand");
        this.charge = this.charge < this.maxCharge ? this.charge + this.chargeRate : this.charge;
      } else if (boost) {
        this.charge -= 0.5;
        if (!this.g.chromobile && Math.abs(this.vy) > 0 && Math.random() > 0.95) {
          let x = this.flip.x ? this.x + this.w * 1.5 : this.x - this.w * 1.5;
          this.g.sfxPlay("jump");
          this.g.spawn("Spark", { x, y: this.y - this.h, vx: this.flip.x ? 2 : -2 });
        }
        this.changeAnim("fly");
      } else {
        this.changeAnim("fly");
      }
      this.g.viewport.y = this.y - this.g.h / 2;
      if (this.g.viewport.y < 0) {
        this.g.viewport.y = 0;
      }
      if (this.g.viewport.y > this.g.viewport.world.h - this.g.h) {
        this.g.viewport.y = this.g.viewport.world.h - this.g.h;
      }
    }
    render() {
      if (this.hide)
        return;
      let r = 8;
      let xOff = this.flip.x ? 0 : -2;
      let yOff = this.vy >= 0 ? -1 : 1;
      this.g.draw.circle(this.x + xOff, this.convY(this.y - this.h / 2), r, this.hairColor);
      let last = { x: this.x, y: this.y };
      if (!this.g.chromobile) {
        this.hair.forEach((h, n) => {
          r--;
          h.x += (last.x - h.x) / 1.5;
          h.y += (last.y + yOff - h.y) / 1.3;
          this.g.draw.circle(h.x + xOff, this.convY(h.y - this.h / 2), r, this.hairColor);
          last = h;
        });
      }
      if (this.anim.name === "fly") {
        let i = this.flip.x ? this.broom2 : this.broom;
        let offsetX = this.flip.x ? this.w + 20 * -1 : -16;
        this.g.draw.img(i, this.x + offsetX, this.convY(this.y - this.h + 10));
      }
      super.render();
    }
    handleInput(boost, left, right) {
      if (boost) {
        this.y += 1;
        if (this.isStanding) {
        }
        this.vy += 0.06;
      }
      if (left) {
        this.x -= this.vx * !this.isStanding;
        this.flip.x = 1;
      } else if (right) {
        this.x += this.vx * !this.isStanding;
        this.flip.x = 0;
      }
    }
    bindToScreen() {
      if (this.isStanding)
        return;
      let g = this.g;
      if (this.x < 0)
        this.x = 0;
      if (this.x > g.w - this.w)
        this.x = g.w - this.w;
      if (this.y > this.g.viewport.world.h - this.h) {
        this.y = this.g.viewport.world.h - this.h;
        this.vy = 0;
      }
    }
    checkStanding() {
      const g = this.g;
      if (!this.isStanding) {
        g.ents.forEach((e) => {
          if (e.constructor.name === "Ledge") {
            if (this.hit(e) && this.vy < 0) {
              if (this.vy <= -1.5) {
                let y = g.viewport.convY(this.y) + this.g.viewport.y;
                g.burst(this.x, y + this.h, 1, 3);
                g.sfxPlay("land");
              }
              this.vy = 0;
              this.y = e.y - 1;
              this.isStanding = true;
              this.ledge = e;
            }
          }
        });
      }
    }
    receiveDamage(o2) {
      if (this.dead)
        return;
      const g = this.g;
      switch (o2.group) {
        case "cat":
          if (!o2.owner) {
            g.sfxPlay("hit");
            g.spawn("Demon", { p: this.p });
            o2.owner = this;
            if (this.p.sess.level === 0) {
              this.g.spawn("Text", {
                y: 300,
                text: "ESCAPE TO BOTTOM",
                col: 7,
                o: 5,
                scale: 3
              });
            }
          }
          break;
        case "door":
          if (o2.open) {
            this.p.levelComplete();
            this.hide = true;
          }
          break;
        case "firefly":
          o2.kill();
          break;
        case "baddies":
          if (!this.falling) {
            let y = g.viewport.convY(this.y) + this.g.viewport.y;
            this.falling = true;
            g.sfxPlay("hit");
            g.spawn("Boom", { x: this.x, y: y + this.h / 2 });
            this.changeAnim("stand");
            this.vy += 0.5;
            this.flip.y = 1;
          }
          break;
        default:
      }
    }
    kill() {
      if (this.dead === true)
        return;
      this.dead = this.remove = true;
      this.g.sfxPlay("fin");
      this.p.sess.lives--;
      if (this.p.sess.lives < 0) {
        this.g.changeState("Gameover");
        return;
      }
      this.g.addEvent({
        t: 70,
        cb: () => {
          this.p.nextLevel();
        }
      });
    }
  };

  // src/game/ents/ledge.js
  var Ledge = class extends Sprite {
    constructor(g, o2) {
      o2.group = "ledge";
      o2.scale = 4;
      o2.h = 8;
      o2.b = o2.b || 0;
      o2.col = o2.col || 14;
      o2.range = o2.range || 200;
      if (o2.vx) {
        o2.vx /= 4;
      }
      if (o2.vy) {
        o2.vy /= 4;
      }
      super(g, o2);
      if (o2.b === 1) {
        this.g.spawn("Spider", { x: this.x, y: this.y, l: this });
      } else if (o2.b === 2) {
        this.g.spawn("Biter", { x: this.x, y: this.y, l: this });
      } else if (o2.b === 3) {
        this.g.spawn("Spider", { x: this.x, y: this.y, l: this });
        this.g.spawn("Biter", { x: this.x, y: this.y, l: this });
      } else if (o2.b === 7) {
        this.p.cat = this.g.spawn("Cat", { x: this.x, y: this.y });
      }
      this.collidesWith = ["player"];
    }
    update(dt) {
      super.update(dt);
      if (this.vx) {
        this.x += this.vx;
      }
      if (this.vy) {
        this.y += this.vy;
        if (this.y > this.o.y + this.range || this.y <= this.o.y) {
          this.vy *= -1;
        }
      }
      if (this.x + this.w > this.g.w || this.x <= 0) {
        this.vx *= -1;
      }
    }
    render() {
      let y = this.g.viewport.convY(this.y) + this.g.viewport.y, hw = this.h / 2, i = this.g.imgs["circle_1_" + this.col];
      this.g.draw.circle(this.x - hw, y + this.h * 3.5, hw + 0, this.col);
      this.g.draw.circle(this.x + this.w - 3, y + this.h * 3.5, hw + 0, this.col);
      this.g.draw.rect(this.x, y + this.h * 3, this.w, this.h, this.col);
      this.g.draw.rect(this.x, y + this.h * 3, this.w, 2, 0, 0.2);
    }
  };

  // src/game/ents/bat.js
  var Bat = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 2;
      o2.scale = o2.s || 3;
      o2.i = "bat";
      o2.group = "baddies";
      super(g, o2);
      this.anims = {
        fly: { frames: [1, 2], rate: 0.3 }
      };
      this.changeAnim("fly");
      this.vx = 1;
      window.B = this;
    }
    update(dt) {
      super.update(dt);
      if (this.x < 0 || this.x > this.g.w - this.w) {
        this.vx *= -1;
      }
      this.x += this.vx;
      this.flip.x = this.vx > 0 ? 1 : 0;
    }
  };

  // src/game/ents/biter.js
  var Biter = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 2;
      o2.scale = 2;
      o2.i = "biter";
      o2.group = "baddies";
      super(g, o2);
      this.y = o2.y - this.h / 2;
      this.minX = o2.l.x;
      this.maxX = o2.l.x + o2.l.w - this.w;
      this.vx = 0.5;
      this.anims = {
        bite: { frames: [1, 2], rate: 0.25 }
      };
      this.changeAnim("bite");
    }
    update(dt) {
      super.update(dt);
      this.x += this.vx;
      if (this.x < this.minX || this.x > this.maxX) {
        this.vx *= -1;
        this.flip.x = !this.flip.x;
      }
    }
  };

  // src/game/ents/spitter.js
  var Spitter = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 1;
      o2.scale = 2;
      o2.i = "spitter";
      o2.group = "baddies";
      super(g, o2);
      this.x = 0;
      if (o2.x !== 0) {
        this.x = this.g.w - this.w;
        this.flip.x = true;
      }
      this.spit();
      this.hasEvent = false;
    }
    spit() {
      if (this.hasEvent)
        return;
      this.hasEvent = true;
      let next = this.g.H.rnd(300, 600);
      this.g.addEvent({
        t: next,
        cb: () => {
          this.spit();
          this.hasEvent = false;
          this.g.spawn("Fireball", { p: this.p, x: this.x, y: this.y });
        }
      });
    }
    render() {
      super.render();
      this.g.draw.rect(this.x + this.w / 2, this.convY(this.maxY), 1, this.maxY - this.y, 1);
    }
  };

  // src/game/ents/spike.js
  var Spike = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 1;
      o2.scale = 2;
      o2.i = "spike";
      o2.group = "baddies";
      super(g, o2);
      this.x = 0;
      if (o2.x !== 0) {
        this.x = this.g.w - this.w;
        this.flip.x = true;
      }
    }
  };

  // src/game/ents/fireball.js
  var Fireball = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 1;
      o2.scale = 2;
      o2.i = "fireball";
      o2.group = "baddies";
      super(g, o2);
      this.y -= this.h / 2;
      if (o2.x <= 0) {
        this.vx = 2;
      } else {
        this.flip.x = true;
        this.vx = -2;
      }
    }
    update(dt) {
      super.update(dt);
      this.x += this.vx;
      if (this.x > this.g.w + this.w || this.x < 0)
        this.remove = true;
    }
  };

  // src/game/ents/firefly.js
  var Firefly = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 2;
      o2.scale = 4;
      o2.i = "firefly";
      o2.group = "firefly";
      super(g, o2);
      this.speed = 120;
      this.anims = {
        fly: { frames: [1, 2], rate: 0.3 }
      };
      this.changeAnim("fly");
      this.vx = 1;
      this.vy = 0.5;
    }
    update(step) {
      super.update(step);
      if (this.x < 0 || this.x > this.g.w - this.w) {
        this.vx *= -1;
      }
      if (this.y < 0 || this.y > this.p.floor - this.h) {
        this.vy *= -1;
      }
      this.x += this.vx;
      this.y += this.vy;
    }
  };

  // src/game/ents/spider.js
  var Spider = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 1;
      o2.scale = 2;
      o2.i = "spider";
      o2.group = "baddies";
      o2.range = 100;
      super(g, o2);
      this.y = o2.y - this.h * 4;
      this.maxY = this.y;
      this.minY = this.y + -o2.range;
      this.vy = -0.2;
      this.x = g.H.rnd(o2.l.x + 20, o2.l.x + o2.l.w - 20);
      this.y = g.H.rnd(this.minY, this.maxY);
    }
    update(dt) {
      if (Math.random() > 0.99)
        this.flip.x = !this.flip.x;
      this.y += this.vy;
      if (this.y < this.minY || this.y > this.maxY) {
        this.vy *= -1;
      }
    }
    render() {
      super.render();
      this.g.draw.rect(this.x + this.w / 2, this.convY(this.maxY), 1, this.maxY - this.y, 1);
    }
  };

  // src/game/ents/demon.js
  var Demon = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 2;
      o2.scale = 3;
      o2.i = "demon";
      o2.group = "baddies";
      super(g, o2);
      this.speed = 120;
      this.anims = {
        fly: { frames: [1, 2], rate: 0.3 }
      };
      this.changeAnim("fly");
      this.vx = 0.5;
      this.vy = 0.75;
      this.x = g.H.rnd(0, 1) ? 0 : g.w - this.h;
      this.y = this.p.tower.h + 50;
      this.body = [];
      for (let n = 0; n < 7; n += 1) {
        this.body.push({ x: this.x, y: this.y });
      }
    }
    update(step) {
      const p1 = this.p.p1;
      if (this.p.tower.fin)
        return;
      super.update(step);
      if (this.x > p1.x) {
        this.x -= this.vx;
        this.flip.x = 1;
      }
      if (this.x < p1.x) {
        this.x += this.vx;
        this.flip.x = 0;
      }
      if (this.y > p1.y)
        this.y -= this.vy;
      if (this.y < p1.y)
        this.y += this.vy;
    }
    render() {
      let last = { y: this.y - this.h / 2, x: this.x };
      if (!this.g.chromobile) {
        this.body.forEach((h, n) => {
          h.x += (last.x - h.x) / 6;
          h.y += (last.y + 1 - h.y) / 6;
          let i = n % 2 ? 7 : 3;
          this.g.draw.circle(h.x, this.convY(h.y), 10, i);
          last = h;
        });
      }
      super.render();
    }
  };

  // src/game/ents/cat.js
  var Cat = class extends Sprite {
    constructor(g, o2) {
      o2.frames = 1;
      o2.scale = 2;
      o2.i = "cat";
      o2.group = "cat";
      super(g, o2);
      this.speed = 120;
      this.anims = {
        o: { frames: [1], rate: 0.3 }
      };
      this.changeAnim("o");
      this.owner = false;
      this.y -= this.h;
      this.oX = this.x;
      this.oY = this.y;
    }
    reset() {
      this.owner = false;
      this.x = this.oX;
      this.y = this.oY;
    }
    update(dt) {
      if (this.owner) {
        this.x = this.owner.flip.x ? this.owner.x + this.w : this.owner.x - this.w;
        this.flip.x = this.owner.flip.x;
        this.y = this.owner.y - this.h / 2;
        if (this.owner.isStanding) {
          this.x = this.owner.x;
          this.y = this.owner.y + this.h / 3;
        }
      } else {
        if (Math.random() > 0.99)
          this.flip.x = !this.flip.x;
      }
    }
    render() {
      if (this.owner && this.owner.hide)
        return;
      super.render();
    }
  };

  // src/game/ents/door.js
  var Door = class extends Sprite {
    constructor(g, o2) {
      o2.group = "door";
      o2.i = "door";
      o2.scale = 4;
      o2.y = 82;
      super(g, o2);
      this.x = g.w / 2 - this.w / 2;
      this.open = false;
      this.pulse = 0;
      this.torch0 = this.g.imgs.torch;
      this.torch1 = this.g.draw.flip(this.torch0, 1, 0);
    }
    update(dt) {
      this.pulse = Math.sin((/* @__PURE__ */ new Date()).getTime() * 2e-3);
    }
    render() {
      if (!this.hit(this.g.viewport))
        return;
      let col = this.open ? 11 : 0, y = this.convY(this.y), o2 = Math.abs(this.pulse / 2), t = o2 > 0.2 ? this.torch0 : this.torch1, ty = y - 3 - this.pulse;
      this.g.draw.rect(this.x, y + 8, this.w, this.h - 8, col);
      if (this.open) {
        this.g.draw.rect(this.x, y + 8, this.w, this.h - 8, 2, Math.abs(this.pulse));
      }
      this.g.draw.circle(this.x - 24, ty + 10, 7, 1, 0.3);
      this.g.draw.img(t, this.x - 20, y, 2);
      this.g.draw.circle(this.x + 46, ty + 10, 7, 1, 0.3);
      this.g.draw.img(t, this.x + 50, y, 2);
      super.render();
    }
  };

  // src/game/ents/boom.js
  var Boom = class {
    constructor(g, o2) {
      o2.col = o2.col || 2;
      this.g = g;
      this.i = g.draw.color(g.imgs.circle, g.data.pal[o2.col]);
      this.startX = o2.x;
      this.startY = o2.y;
      this.magnitude = o2.m || 4;
      this.scale = 1;
      this.factor = o2.factor || 0.5;
    }
    update(step) {
      let g = this.g;
      this.scale += this.factor;
      if (this.scale > this.magnitude && this.factor > 0) {
        this.factor *= -1;
      }
      if (this.scale <= 1) {
        this.remove = true;
      }
    }
    render() {
      let s = this.i.width * this.scale / 2, x = this.startX - s, y = this.startY - s, g = this.g;
      g.draw.img(this.i, x, y, this.scale);
    }
  };

  // src/game/ents/particle.js
  var Particle = class {
    constructor(g, o2) {
      this.g = g;
      this.o = o2;
      this.x = o2.x;
      this.y = o2.y;
      this.w = o2.w || 3;
      this.h = this.w;
      this.vx = o2.vx || g.H.rnd(-40, 40);
      this.vy = o2.vy || g.H.rnd(50, 80) * -1;
      this.col = o2.col || 6;
      this.r = o2.r || 1;
      this.i = g.imgs[`${o2.img}_${this.w}_${this.col}`];
      this.ttl = 200;
    }
    update(dt) {
      this.ttl -= 1;
      this.vy += this.g.data.gravity * 0.15;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.y > this.o.y || this.ttl < 0) {
        this.remove = true;
      }
    }
    render(dt) {
      let y = this.g.viewport.convY(this.y) + this.g.viewport.y;
      y = this.y;
      this.g.draw.circle(this.x, this.y, this.w / 2, this.col);
    }
  };

  // src/game/ents/spark.js
  var Spark = class extends Sprite {
    constructor(g, o2) {
      o2.cols = [7, 8, 3];
      o2.size = g.H.rnd(3, 6);
      o2.size = 8;
      o2.vy = 0.3;
      o2.tick = 0;
      super(g, o2);
      this.vx /= 2;
      this.col = this.cols[this.size - 2] || this.g.H.rndArray(this.cols);
      this.ttl = 75;
    }
    update(dt) {
      this.ttl--;
      if (this.ttl < 0) {
        this.remove = true;
      }
      this.tick += 1;
      if (this.tick % 25 === 0 && this.size > 1) {
        this.size -= 1;
      }
      this.x += this.vx;
      this.y -= this.vy;
    }
    render() {
      if (this.size < 1)
        return;
      this.col = 1;
      const o2 = this.size / 10 / 2;
      this.g.draw.ring(this.x, this.convY(this.y), this.size, this.col, 3, o2);
    }
  };

  // src/game/ents/text.js
  var Text = class extends Sprite {
    constructor(g, o2) {
      o2.group = "text";
      o2.w = 10;
      o2.w = 10;
      o2.o = o2.o || 1;
      o2.scale = o2.scale || 2;
      o2.col = o2.col || 1;
      o2.fade = o2.fade || 0.01;
      super(g, o2);
      for (let n in o2) {
        this[n] = o2[n];
      }
      this.g = g;
      this.p = g.H.mkFont(g, o2.scale, o2.col);
    }
    update(step) {
      if (this.y < 0 || this.o < 0)
        this.remove = true;
      this.o -= this.fade;
    }
    render() {
      if (this.o < 0)
        return;
      let d = this.g.draw;
      d.ctx.globalAlpha = this.o;
      d.text(this.text, this.p, this.x, this.y);
      d.ctx.globalAlpha = 1;
    }
  };

  // src/lib/zzfx.js
  var zzfx;
  var zzfxV;
  var zzfxX;
  zzfxV = 0.3;
  zzfx = // play sound
  (p = 1, k = 0.05, b = 220, e = 0, r = 0, t = 0.1, q = 0, D = 1, u = 0, y = 0, v = 0, z = 0, l = 0, E = 0, A = 0, F = 0, c = 0, w = 1, m = 0, B = 0, M = Math, R = 44100, d = 2 * M.PI, G = u *= 500 * d / R / R, C = b *= (1 - k + 2 * k * M.random(k = [])) * d / R, g = 0, H = 0, a = 0, n = 1, I = 0, J = 0, f = 0, x, h) => {
    e = R * e + 9;
    m *= R;
    r *= R;
    t *= R;
    c *= R;
    y *= 500 * d / R ** 3;
    A *= d / R;
    v *= d / R;
    z *= R;
    l = R * l | 0;
    for (h = e + m + r + t + c | 0; a < h; k[a++] = f)
      ++J % (100 * F | 0) || (f = q ? 1 < q ? 2 < q ? 3 < q ? M.sin((g % d) ** 3) : M.max(M.min(M.tan(g), 1), -1) : 1 - (2 * g / d % 2 + 2) % 2 : 1 - 4 * M.abs(M.round(g / d) - g / d) : M.sin(g), f = (l ? 1 - B + B * M.sin(d * a / l) : 1) * (0 < f ? 1 : -1) * M.abs(f) ** D * zzfxV * p * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) : a < e + m + r ? w : a < h - c ? (h - a - c) / t * w : 0), f = c ? f / 2 + (c > a ? 0 : (a < h - c ? 1 : (h - a) / c) * k[a - c | 0] / 2) : f), x = (b += u += y) * M.cos(A * H++), g += x - x * E * (1 - 1e9 * (M.sin(a) + 1) % 2), n && ++n > z && (b += v, C += v, n = 0), !l || ++I % l || (b = C, u = G, n ||= 1);
    p = zzfxX.createBuffer(1, h, R);
    p.getChannelData(0).set(k);
    b = zzfxX.createBufferSource();
    b.buffer = p;
    b.connect(zzfxX.destination);
    b.start();
    return b;
  };
  zzfxX = new AudioContext();
  var zzfx_default = zzfx;

  // src/game/index.js
  var o = base_default;
  o.states = { Ready, Title, Play, Gameover, Win };
  o.ents = { Sprite, Witch, Ledge, Bat, Biter, Spitter, Spike, Fireball, Firefly, Demon, Cat, Spider, Door, Boom, Particle, Spark, Text };
  o.Sfx = zzfx_default;
  new Game(o).init();
})();
