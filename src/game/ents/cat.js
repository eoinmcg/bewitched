import Sprite from './sprite';

export default class Cat extends Sprite {
  constructor(g, o) {
    o.frames = 1
    o.scale = 2;
    o.i = 'cat';
    o.group = 'cat';
    super(g, o);
    this.speed = 120;
    this.anims = { 
      o: { frames: [1], rate: 0.3 },
    };
    this.changeAnim('o');
    this.owner = false;

    this.y -= this.h;

    this.oX = this.x;
    this.oY = this.y;
  }

  reset() {
    this.owner = false;
    this.x = this.oX;
    this.y = this.oY;
  }

  update(dt) {
    // super.update(dt);
    if (this.owner) {
      this.x = this.owner.flip.x
       ? this.owner.x + this.w
       : this.owner.x - this.w;
      this.flip.x = this.owner.flip.x;
      this.y = this.owner.y - this.h / 2;
      if (this.owner.isStanding) {
        this.x = this.owner.x
        this.y = this.owner.y + this.h / 3;
      }
    } else {
      if (Math.random() > 0.99) this.flip.x = !this.flip.x
    }
  }

  render() {
    if (this.owner && this.owner.hide) return;
    super.render();
  }

}
