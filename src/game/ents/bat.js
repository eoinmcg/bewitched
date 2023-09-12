import Sprite from './sprite';

export default class Bat extends Sprite {
  constructor(g, o) {
    o.frames = 2
    o.scale = o.s || 3;
    o.i = 'bat';
    o.group = 'baddies';
    super(g, o);
    this.anims = { 
      fly: { frames: [1,2], rate: 0.3 },
    };
    this.changeAnim('fly');
    this.vx = 1;
    window.B = this;
  }

  update(dt) {
    super.update(dt);
    if (this.x < 0 || this.x > (this.g.w - this.w)) {
      this.vx *= -1
    }
    this.x += this.vx;

    this.flip.x = this.vx > 0 ? 1 : 0;

  }


}

