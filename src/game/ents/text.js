import Sprite from './sprite'

export default class Text extends Sprite {

  constructor(g, o) {
    o.group = 'text';
    o.w = 10;
    o.w = 10;
    o.o = o.o || 1;
    o.scale = o.scale || 2;
    o.col = o.col || 1;
    o.fade = o.fade || 0.01;
    super(g, o);
    for (let n in o) {
      this[n] = o[n];
    }
    this.g = g;
    this.p = g.H.mkFont(g, o.scale, o.col);
  }

  update(step) {
    if (this.y < 0 || this.o < 0) this.remove = true;
    this.o -= this.fade; 
  }

  render() {
    if( this.o < 0) return;
    let d = this.g.draw;
    d.ctx.globalAlpha = this.o;
    d.text(this.text, this.p, this.x, this.y);
    d.ctx.globalAlpha = 1;
  }
}

