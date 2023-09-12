import Sprite from './sprite'

export default class Ledge extends Sprite {
  constructor(g, o) {
    o.group = 'ledge';
    o.scale = 4;
    o.h = 8;
    o.b = o.b || 0;
    o.col = o.col || 14;
    o.range = o.range ||  200;
    if (o.vx) { o.vx /= 4; }
    if (o.vy) { o.vy /= 4; }
    super(g, o);
    if (o.b === 1) {
      this.g.spawn('Spider', {x: this.x, y: this.y, l: this });
    } else if (o.b === 2) {
      this.g.spawn('Biter', {x: this.x, y: this.y, l: this });
    } else if (o.b === 3) {
      this.g.spawn('Spider', {x: this.x, y: this.y, l: this });
      this.g.spawn('Biter', {x: this.x, y: this.y, l: this });
    } else if (o.b === 7) {
      this.p.cat = this.g.spawn('Cat', {x: this.x, y: this.y});
    }
    this.collidesWith = ['player'];
  }

  update(dt) {
    super.update(dt);
    if (this.vx) {
      this.x += this.vx;
    }
    if (this.vy) {
      this.y += this.vy;
      if (this.y > this.o.y + this.range || this.y <= this.o.y) {
        this.vy *= -1;
      }
    }
    if (this.x + this.w > this.g.w || this.x <= 0) {
      this.vx *= -1;
    }
  }

  render() {
    let y = this.g.viewport.convY(this.y) + this.g.viewport.y, 
      hw = this.h/2,
      i = this.g.imgs['circle_1_' + this.col];
    this.g.draw.circle(this.x - hw, y + this.h * 3.5, hw + 0, this.col);
    this.g.draw.circle(this.x + this.w - 3, y + this.h * 3.5, hw + 0, this.col);
    this.g.draw.rect(this.x, y + this.h * 3, this.w, this.h, this.col);
    this.g.draw.rect(this.x, y + this.h * 3, this.w, 2, 0, 0.2);
  } 
}

