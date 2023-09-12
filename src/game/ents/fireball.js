import Sprite from './sprite';

export default class Fireball extends Sprite {
  constructor(g, o) {
    o.frames = 1;
    o.scale = 2;
    o.i = 'fireball';
    o.group = 'baddies';
    super(g, o);

    this.y -= this.h / 2;
    if (o.x <= 0) {
      this.vx = 2;
    } else {
      this.flip.x = true;
      this.vx = -2;
    }
  }

  update(dt) {
    super.update(dt);
    this.x += this.vx;
    if (this.x > this.g.w + this.w || this.x < 0) this.remove = true;
  }

}

