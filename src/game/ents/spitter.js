import Sprite from './sprite';

export default class Spitter extends Sprite {
  constructor(g, o) {
    o.frames = 1
    o.scale = 2;
    o.i = 'spitter';
    o.group = 'baddies';
    super(g, o);
    this.x = 0;
    if (o.x !== 0) {
      this.x = this.g.w - this.w;
      this.flip.x = true;
    }

    this.spit();
    this.hasEvent = false;

  }


  spit() {
    if (this.hasEvent) return;
    this.hasEvent = true;
    let next = this.g.H.rnd(300, 600);
    this.g.addEvent({
      t: next,
      cb: () => {
        this.spit();
        this.hasEvent = false;
        this.g.spawn('Fireball', {p: this.p, x: this.x, y: this.y})
      }
    });
  }

  render() {
    super.render();
    this.g.draw.rect(this.x + this.w / 2, this.convY(this.maxY), 1, this.maxY - this.y, 1);
  }


}



