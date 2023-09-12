import Loader from './loader';
import Canvas from './canvas';
import Draw from './draw';
import Input from './input';

import H from './helpers';

export default function Game(o = {}) {
  const defaults = {
    w: 320,
    h: 480,
    orientation: 'portrait'
  };

  let ua = navigator.userAgent.toLowerCase();

  this.android = ua.indexOf('android') > -1;
  this.ios = /ipad|iphone|ipod/.test(ua);
  this.mobile = (this.android || this.ios);
  this.firefox = ua.indexOf('firefox') > -1;
  this.chrome = ua.indexOf('chrome') > -1;
  this.chromobile = this.mobile && this.chrome // chrome on android runs as fast a hipp with a sprained ankle

  for (let n in defaults) { this[n] = defaults[n]; }
  this.o = Object.assign(defaults, o);
  this.data = o;
  this.dt   = 0;
  this.fps  = 60;
  this.frameStep = 1/ this.fps;
  this.frameCurr = 0;
  this.framePrev = H.timeStamp();
  this.stateName = o.start;
  this.H = H;

  this.states = o.states;
  this.availEnts = o.ents;

  this.score = 0;
  this.hiScore = 20;
  this.plays = 0;

  this.ents = [];
  this.imgs = [];
  this.fonts = [];
  this.events = [];
  this.transition = false;
  this.H = H;

  this.Sfx = o.Sfx;

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
        this.maxY = h - this.h
        this.y = 0;
      },
      convY: function(y) {
        return ~~((this.h -  y));
      },
      move: function(dir) {
        this.y += dir;
        if (this.y < 0) this.y = 0;
        if (this.y > this.maxY) this.y = this.maxY;
      }
    }

    loader.start().then((res) => {
      this.imgs = res;
      this.makeFonts(this.imgs.font);
      document.getElementById('l').style.display = 'none';
      this.changeState(this.stateName);
      this.canvas.c.style.display = 'block';
      this.favIcon(this.draw.resize(this.imgs.cat, 8));
      this.loop();
    });
  };

  this.makeFonts = function(f) {
    let i = 12;
    while (i-- > 1) {
      this.imgs['font_'+i] = this.draw.resize(f, i);
    }
  }

  this.favIcon = function(i) {
    let c = document.createElement('canvas'),
        ctx = c.getContext('2d'),
        l = document.createElement('link');
    c.width = c.height = 64;
    ctx.drawImage(i, 0, 0);
    l.type = 'image/x-icon';
    l.rel = 'shortcut icon';
    l.href = c.toDataURL('image/x-icon');
    document.getElementsByTagName('head')[0].appendChild(l);
  };

  this.sfxPlay = function(key) {
    if (this.ios) return;
    this.Sfx(...this.data.sfx[key]);
  }

  this.changeState = function(state) {
    this.ents = [];
    this.events = [];
    this.state = new this.states[state](this);
    this.input.resetKeys();
    this.state.init();
    this.transition = false;
  };

  this.loop = function() {
    this.frameCurr = H.timeStamp();
    this.dt = this.dt + Math.min(1, (this.frameCurr - this.framePrev) / 1000);

    while (this.dt > this.frameStep) {
      this.dt = this.dt - this.frameStep;
      this.update(this.frameStep);
    }

    this.render(this.dt);
    this.framePrev = this.frameCurr;
    requestAnimationFrame(() => this.loop());
  }

  this.update = function(step) {
    this.fader = Math.sin(new Date().getTime() * 0.005);
    this.runEvents(step);
    this.state.update(step);

    let i = this.ents.length;
    while (i--) {
      if (this.ents[i].remove) {
        this.ents.splice(i, 1);
      }
    }
    this.state.update(step);
  }

  this.render = function(step) {
    this.state.render(step);
  }

  this.spawn = function(ent, opts) {
    const sprite = new this.availEnts[ent](this, opts);
    this.ents.push(sprite);
    return sprite;
  }

  this.burst = function(x, y, col, num, w = 3) {
    while (num--) {
      this.ents.push(new this.availEnts.Particle(this, {
        x, y, col, w,
      }));
    }
  }

  this.addEvent = function(e) {
    this.events.push(e);
  }

  this.runEvents = function(step) {
    this.events.forEach((e, i) => {
      e.t -= step * 100;
      if (e.t < 0) {
        e.cb.call(this);
        this.events.splice(i, 1);
      }
    });
  }

  return this;

}
