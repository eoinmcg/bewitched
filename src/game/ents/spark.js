import Sprite from './sprite'

export default class Spark extends Sprite {
  constructor(g, o) {
    o.cols = [7,8,3];
    o.size = g.H.rnd(3,6);
    o.size = 8;
    o.vy = 0.3;
    o.tick = 0;
    super(g, o);
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
    if (this.size < 1) return;
    this.col = 1;
    const o = this.size / 10 / 2;
    this.g.draw.ring(this.x, this.convY(this.y), this.size, this.col, 3,  o);
  }
}

