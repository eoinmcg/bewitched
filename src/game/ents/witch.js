import Sprite from './sprite'

export default class Witch extends Sprite {

  constructor(g, o) {
    o.group = 'player';
    o.i = 'witch'
    o.collidesWith = ['baddies', 'firefly', 'cat', 'door'];
    o.scale = 3;
    o.frames = 3;
    super(g, o);

    this.g = g;
    this.o = o;
    this.anims = {
      fly: { frames: [3], rate: 0.025 },
      stand: { frames: [2, 2, 2, 1], rate: 0.3 },
    };
    this.changeAnim('stand');
    this.gravity = g.data.gravity;
    this.maxCharge = 100;
    this.chargeRate = 2;
    this.charge = this.maxCharge;
    this.vx = 2;
    this.maxVy = 2;
    this.minVy = 3;
    this.hide = true;

    this.broom = g.draw.resize(g.imgs.broom, this.scale);
    this.broom2 = g.draw.flip(this.broom, 1, 0);

    this.hairColor = g.H.rndArray([2,8,4,15,7])

    window.W = this;
    this.reset();
  }

  reset() {
    if (!this.hide) return;
    const g = this.g;
    this.vy = 0;
    this.x = g.w / 2;
    this.g.viewport.y = 0;
    this.y = this.convY(this.g.h - 50);
    this.isStanding = false;
    this.flip.y = 0;

    this.dead = false;
    this.hide = false;
    this.falling = false;

    this.hair = [];
    let i = 6;
    while(i) {
      this.hair.push({x: this.x, y: this.y, s:  i})
      i--;
    }

  }

  update(dt) {
    super.update(dt);
    this.isStanding = false;
    this.ledge = false;
    let g = this.g,
      k = g.input.keys,
      boost = k.click;

    boost = ((k.l || k.r) && this.charge > 0);

    this.vy -= (this.gravity / 4) * dt;

    if (this.falling || this.y < this.h) {
      this.y = ~~(this.y + this.vy);
      if (this.y - this.h < this.g.viewport.y && !this.dead) {
          this.kill();
      }
      return;
    }

    if (this.vy > this.maxVy) this.vy = this.maxVy;
    if (this.vy < -this.minVy) this.vy = -this.minVy;

    this.checkStanding();
    this.bindToScreen();
    this.handleInput(boost, k.l, k.r);

    this.y = ~~(this.y + this.vy);

    if (this.ledge && this.ledge.vx) {
      this.x += this.ledge.vx;
    }

    if (this.isStanding) {
      this.changeAnim('stand');
      this.charge = this.charge < this.maxCharge
        ? this.charge + this.chargeRate
        : this.charge;
    } else if (boost) {
      this.charge -= 0.5;
      if (!this.g.chromobile && Math.abs(this.vy) > 0 && Math.random() > 0.95) {
        let x = this.flip.x ? this.x + this.w * 1.5 : this.x - this.w * 1.5;
        this.g.sfxPlay('jump');
        this.g.spawn('Spark', {x: x, y: this.y - this.h, vx: this.flip.x ? 2 : -2 });
      }
      this.changeAnim('fly');
    } else {
      this.changeAnim('fly');
    }

    this.g.viewport.y = this.y - (this.g.h / 2);
    if (this.g.viewport.y < 0) { this.g.viewport.y = 0; }
    if (this.g.viewport.y > this.g.viewport.world.h - this.g.h) { 
      this.g.viewport.y = this.g.viewport.world.h - this.g.h; 
    }
  }

  render() {
    if (this.hide) return;

    let r = 8;
    let xOff = this.flip.x ? 0 : -2;
    let yOff = this.vy >= 0 ? -1 : 1;
    this.g.draw.circle(this.x + xOff, this.convY(this.y - this.h / 2), r, this.hairColor);
    let last = {x: this.x, y: this.y}

    if (!this.g.chromobile) {
      this.hair.forEach((h, n) => {
        r--;
        h.x += (last.x - h.x) / 1.5;
        h.y += (last.y + yOff - h.y) / 1.3;
        this.g.draw.circle(h.x + xOff, this.convY(h.y - this.h / 2), r, this.hairColor);
        last = h;
      })
    }

    if (this.anim.name === 'fly') {
      let i = this.flip.x ? this.broom2 : this.broom;
      let offsetX = this.flip.x ? this.w + 20 * -1 : - 16;
      this.g.draw.img(i, this.x + offsetX, this.convY(this.y - this.h + 10));
    }

    super.render();
  }

  handleInput(boost, left, right) {
    if (boost) {
      this.y += 1;
      if (this.isStanding) {
        // this.vy += 0.02;
      }
      this.vy += 0.06;
    }
    if (left) {
      this.x -= this.vx * !this.isStanding;
      this.flip.x = 1;
    } else if (right) {
      this.x += this.vx * !this.isStanding;
      this.flip.x = 0;
    }
  }

  bindToScreen() {
    if (this.isStanding) return;
    let g = this.g;

    if (this.x < 0) this.x = 0;
    if (this.x > g.w - this.w) this.x = g.w - this.w;
    if (this.y > this.g.viewport.world.h - this.h) {
      this.y = this.g.viewport.world.h - this.h;
      this.vy = 0;
    }
  }

  checkStanding() {
    const g = this.g
    if (!this.isStanding) {
      g.ents.forEach((e) => {
        if (e.constructor.name === 'Ledge') {
          if (this.hit(e) && this.vy < 0) {
            if (this.vy <= -1.5) {
              let y = g.viewport.convY(this.y) + this.g.viewport.y;
              g.burst(this.x, y + this.h, 1, 3);
              g.sfxPlay('land');
            }
            this.vy = 0;
            this.y = e.y - 1;
            this.isStanding = true;
            this.ledge = e;
          }
        }
      });
    }
  }

  receiveDamage(o) {
    if (this.dead) return;
    const g = this.g;
    switch (o.group) {
      case 'cat':
        if (!o.owner) {
          g.sfxPlay('hit');
          g.spawn('Demon', {p: this.p });
          o.owner = this;
          if (this.p.sess.level === 0) {
            this.g.spawn('Text', {
              y: 300, text: 'ESCAPE TO BOTTOM', col: 7, o: 5, scale: 3});
          }
        }
        break;
      case 'door':
        if (o.open) {
          this.p.levelComplete();
          this.hide = true;
        }
        break;
      case 'firefly':
        o.kill();
        // console.log('BING');
        break;
      case 'baddies':
        if (!this.falling) {
          let y = g.viewport.convY(this.y) + this.g.viewport.y;
          this.falling = true;
          g.sfxPlay('hit');
          g.spawn('Boom', { x: this.x, y: y + this.h / 2 });
          this.changeAnim('stand');
          this.vy += 0.5;
          this.flip.y = 1;
        }
        break;
      default:
    }
  }

  kill() {
    if (this.dead === true) return;
    this.dead = this.remove = true;
    this.g.sfxPlay('fin');
    this.p.sess.lives--;

    if (this.p.sess.lives < 0) {
      this.g.changeState('Gameover');
      return;
    }

    this.g.addEvent({
      t: 70,
      cb: () => {
        this.p.nextLevel();
      }
    });
  }
}
