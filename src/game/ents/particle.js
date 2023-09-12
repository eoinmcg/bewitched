export default class Particle {
  constructor(g, o) {
    this.g = g;
    this.o = o;
    this.x = o.x;
    this.y = o.y;
    this.w = o.w || 3;
    this.h = this.w;
    this.vx = o.vx ||  g.H.rnd(-40, 40);
    this.vy = o.vy ||  g.H.rnd(50, 80) * -1;
    this.col = o.col || 6;
    this.r = o.r || 1;
    this.i = g.imgs[`${o.img}_${this.w}_${this.col}`];
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
}

