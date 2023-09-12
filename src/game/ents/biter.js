import Sprite from './sprite';

export default class Biter extends Sprite {
  constructor(g, o) {
    o.frames = 2;
    o.scale = 2;
    o.i = 'biter';
    o.group = 'baddies';
    super(g, o);
    this.y = o.y - this.h / 2;
    this.minX = o.l.x;
    this.maxX = o.l.x + o.l.w - this.w;
    this.vx= 0.5;

    this.anims = {
      bite: { frames: [1,2], rate: .25 },
    };
    this.changeAnim('bite');
  }

  update(dt) {
    super.update(dt);
    this.x += this.vx;
    if (this.x < this.minX || this.x > this.maxX) {
      this.vx *= -1;
      this.flip.x = !this.flip.x;
    }
  }

}
