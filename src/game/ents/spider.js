import Sprite from './sprite';

export default class Spider extends Sprite {
  constructor(g, o) {
    o.frames = 1
    o.scale = 2;
    o.i = 'spider';
    o.group = 'baddies';
    o.range = 100;
    super(g, o);
    this.y = o.y - this.h * 4;
    this.maxY = this.y;
    this.minY = this.y + - o.range;
    this.vy = -0.2;
    this.x = g.H.rnd(o.l.x + 20, o.l.x + o.l.w - 20);
    this.y = g.H.rnd(this.minY, this.maxY);
  }

  update(dt) {
    if (Math.random() > 0.99) this.flip.x = !this.flip.x
    this.y += this.vy;
    if (this.y < this.minY || this.y > this.maxY) {
      this.vy *= -1;
    }
  }

  render() {
    super.render();
    this.g.draw.rect(this.x + this.w / 2, this.convY(this.maxY), 1, this.maxY - this.y, 1);
  }


}


