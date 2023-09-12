import Tower from '../ents/tower';

export default class Play {
  constructor(g) {
    this.g = g;
    window.P = this;

    this.tower = {
      fin: false,
      h: this.g.h * 3,
      bg: 12,
    }

    this.mainText = g.H.mkFont(g, 3, 11);
    this.curtain = {
      active: false,
      h: 0
    }
    this.g.plays += 1;
  }

  init() {
    this.tower = new Tower(this);
    this.sess = {
      level: this.g.plays < 2 ? 0 : 1,
      score: 0,
      time: 0,
      lives: 2,
      gameOver: false
    }
    // this.sess.level = 5;
    this.nextLevel();
  }

  nextLevel() {
    let gw = this.g.w;
    this.g.ents = [];
    this.g.events = [];
    this.bgBlocks = [ ];

    this.tower.init(this.sess.level);
    if (this.tower.complete) {
      this.g.changeState('Win');
      return;
    }

    let startX = 200;
    let maxX = ~~(this.tower.h / startX);
    let o = 0.1;
    for (let n = 1; n < maxX; n += 1) {
      let i = Math.random() > 0.5 ? 1 : 2;
      this.bgBlocks.push(['brick' + i, -20, startX * n + 20, 16, o]);
      this.bgBlocks.push(['brick' + i, 240, startX * n + 20, 16, o]);
      if (n % 2 !== 0) this.bgBlocks.push(['brick'+i, gw/2, startX * n + 20, 5, o]);
    }

    this.door = this.g.spawn('Door', {p: this});
    this.p1 = this.g.spawn('Witch', {p: this  });
    this.g.viewport.init(this.tower.h);
    this.g.viewport.y = this.tower.h - this.g.h;

    if (this.sess.level === 0 && this.sess.lives === 2) {
      this.helpText();
    } else if (this.sess.level > 0) {
      this.addText('LEVEL ' + this.sess.level, 50, false, 300, 11, 4);
      this.addText(this.tower.n, 100, false, 340, 11, 4);
    }
  }

  update(dt) {
    if (!this.door.open && this.cat.owner) {
      this.door.open = true;
    }

    if (this.curtain.active && this.curtain.h < this.g.h) {
      this.curtain.h += 10;
    } else if (this.curtain.h > 0) {
      this.curtain.h -= 15;
    }

    this.g.ents.forEach((e) => {
      e.update(dt);
    }); 
  }

  render() {
    const g = this.g;
    g.draw.clear(this.tower.bg);

    const cy = this.convertY.bind(this);
    const convY = this.g.viewport.convY.bind(this.g.viewport);

    //lava
    g.draw.rect(0, cy(18), g.w, 50, 3);
    g.draw.rect(0, cy(18), g.w, 2, 0, 0.3);

    this.bgBlocks.forEach((e) => {
      let y = cy(e[2]),
          h = g.imgs[e[0]].height * e[3];
      let onScreen = g.viewport.y  < y + h 
                      || g.viewport.y > y + h;
      if (onScreen && !g.android) {
        g.draw.img(g.imgs[e[0]], e[1], y, e[3], e[4]);
      }
    });

    this.g.ents.forEach((e) => {
      e.render();
    });


    if (this.p1) {
      g.draw.rect(18, 16, this.p1.maxCharge + 4, 14, 0);
      g.draw.rect(20, 18, this.p1.charge, 10, 11);
      g.draw.rect(20, 18, this.p1.charge, 4, 2, 0.3);
    }

    let lives = this.sess.lives;
    while(lives--) {
      g.draw.img(g.imgs.heart, 300 - lives * 20 , 20, 2);
    }

    if (this.curtain.h > 0) {
      g.draw.rect(0, 0, g.w, this.curtain.h, 0);
    }
    if (this.curtain.active && this.curtain.h >= g.h) {
      this.sess.level += 1;
      this.nextLevel();
      this.curtain.active = false;
    }
  }

  convertY(y) {
    return (this.g.h - y) + this.g.viewport.y;
  }

  levelComplete() {
    if (!this.tower.fin) {
      this.tower.fin = true;
      this.g.sfxPlay('piano');
      this.curtain.active = true;
    }
  }

  helpText() {
    let textL = 'HOLD LEFT ARROW';
    let textR = 'HOLD RIGHT ARROW';
    if (this.g.mobile) {
      textL = textR = 'HOLD HERE';
    }

    this.addText(textL, 50, 10, 310);
    this.addText('TO FLY LEFT', 50, 10, 330);
    this.addText(textR, 400, 180, 310);
    this.addText('TO FLY RIGHT', 400, 180, 330);
    this.addText('NOW RESCUE CAT', 770, false, 100, 7, 4);
  }

  addText(text, delay, x = 10, y = 310, col = 1, scale = 2) {
    this.g.addEvent({
      t: delay,
      cb: () => {
        this.g.spawn('Text', {x: x, y: y, text: text, col: col, o: 5, scale: scale});
      }
    });
  }
}
