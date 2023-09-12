import Sprite from './sprite';

export default class Spike extends Sprite {
  constructor(g, o) {
    o.frames = 1
    o.scale = 2;
    o.i = 'spike';
    o.group = 'baddies';
    super(g, o);
    this.x = 0;
    if (o.x !== 0) {
      this.x = this.g.w - this.w;
      this.flip.x = true;
    }
  }

}
