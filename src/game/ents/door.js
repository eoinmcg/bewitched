import Sprite from './sprite'

export default class Door extends Sprite {
  constructor(g, o) {
    o.group = 'door';
    o.i = 'door';
    o.scale = 4;
    o.y = 82;
    super(g, o);
    this.x = g.w / 2 - this.w / 2;
    this.open = false;
    this.pulse = 0;
    this.torch0 = this.g.imgs.torch;
    this.torch1 = this.g.draw.flip(this.torch0, 1, 0);
  }

  update(dt) {
    this.pulse = Math.sin(new Date().getTime() * 0.002);
  }

  render() {
    if (!this.hit(this.g.viewport)) return;
    let col = this.open ? 11 : 0,
        y = this.convY(this.y),
        o = Math.abs(this.pulse / 2),
        t = o > 0.2 ? this.torch0 : this.torch1,
        ty = y - 3 - (this.pulse);

    this.g.draw.rect(this.x, y + 8, this.w, this.h - 8, col);
    if (this.open) {
      this.g.draw.rect(this.x, y + 8, this.w, this.h - 8, 2, Math.abs(this.pulse));
    }
    this.g.draw.circle(this.x - 24, ty + 10, 7, 1, 0.3);
    this.g.draw.img(t, this.x - 20, y, 2);
    this.g.draw.circle(this.x + 46, ty + 10, 7, 1, 0.3);
    this.g.draw.img(t, this.x + 50, y, 2);
    super.render();
  }

}


