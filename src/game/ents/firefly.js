import Sprite from './sprite';

export default class Firefly extends Sprite {
  constructor(g, o) {
    o.frames = 2
    o.scale = 4;
    o.i = 'firefly';
    o.group = 'firefly';
    super(g, o);
    this.speed = 120;
    this.anims = { 
      fly: { frames: [1,2], rate: 0.3 },
    };
    this.changeAnim('fly');
    this.vx = 1;
    this.vy = 0.5;
  }

  update(step) {
    super.update(step);
    if (this.x < 0 || this.x > (this.g.w - this.w)) {
      this.vx *= -1
    }
    if (this.y < 0 || this.y > (this.p.floor - this.h)) {
      this.vy *= -1
    }
    this.x += this.vx;
    this.y += this.vy;
  }


}
