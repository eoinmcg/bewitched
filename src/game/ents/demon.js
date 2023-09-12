import Sprite from './sprite';

export default class Demon extends Sprite {
  constructor(g, o) {
    o.frames = 2
    o.scale = 3;
    o.i = 'demon';
    o.group = 'baddies';
    super(g, o);
    this.speed = 120;
    this.anims = { 
      fly: { frames: [1,2], rate: 0.3 },
    };
    this.changeAnim('fly');
    this.vx = 0.5;
    this.vy = 0.75;
    this.x = g.H.rnd(0,1) ? 0 : g.w - this.h;
    this.y = this.p.tower.h + 50;
    this.body = [];
    for (let n = 0; n < 7; n += 1) {
      this.body.push({x: this.x, y: this.y });
    }
  }

  update(step) {
    const p1 = this.p.p1;
    if (this.p.tower.fin) return;
    super.update(step);
    if (this.x > p1.x) { this.x -= this.vx; this.flip.x = 1; }
    if (this.x < p1.x) { this.x += this.vx; this.flip.x = 0; }
    if (this.y > p1.y) this.y -= this.vy;
    if (this.y < p1.y) this.y += this.vy;
  }
  
  render() {
    let last = {y: this.y - this.h / 2, x:  this.x};
    if (!this.g.chromobile) {
      this.body.forEach((h, n) => {
        h.x += (last.x - h.x) / 6;
        h.y += (last.y + 1 - h.y) / 6;
        let i = n % 2 ? 7 : 3;
        this.g.draw.circle(h.x, this.convY(h.y), 10, i);
        last = h;
      })
    }
    super.render();



  }


}

