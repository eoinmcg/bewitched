export default class Win {

  constructor(g) {
    this.g = g;

    this.mainText = g.H.mkFont(g, 7, 2);
    this.canSwitch = false;

    this.o = 0;

    this.cat2 = g.draw.flip(g.imgs.cat1, 1, 0);
  }

  init() { 
    this.g.sfxPlay('win');
    this.confetti();
    this.g.addEvent({
      t: 500,
      cb: () => {
        this.canSwitch = true;
      }
    })
    this.g.addEvent({
      t: 100,
      cb: () => {
        this.g.spawn('Text', {text: 'YAYYY', x: 20, y: 350, col: 2, scale: 3, o: 4})
        this.g.sfxPlay('speak');
      }
    })
    this.g.addEvent({
      t: 200,
      cb: () => {
        this.g.spawn('Text', {text: 'YOU AWESOME', x: 180, y: 350, col: 12, scale: 3, o: 4})
        this.g.sfxPlay('speak');
      }
    })
  }

  confetti() {
    this.g.addEvent({
      t: this.g.H.rnd(100,300),
      cb: () => {
        let x = this.g.H.rnd(50, this.g.w - 50),
            y = this.g.H.rnd(100, this.g.h - 100);
        this.g.burst(x, y, 4, 5, 4);
        this.g.sfxPlay('jump');
        this.confetti();
      }
    })
  }

  update(dt) {
    if (this.o < 0.5) {
      this.o += dt / 10;
    }

    this.g.ents.forEach((e) => {
      e.update(dt);
    }); 

    if (this.g.input.click && this.canSwitch) {
      this.g.changeState('Title');
    }

  }

  render() {
    const g = this.g;
    g.draw.clear(14);
    g.draw.rect(0, 430, g.w, g.h, 11);

    g.draw.text('YOU', this.mainText, false, 70);
    g.draw.text('WIN', this.mainText, false, 120);

    g.draw.img(g.imgs.cat, 20, 400, 5);
    g.draw.img(this.cat2, 250, 400, 5);

    this.g.ents.forEach((e) => {
      e.render();
    });

  }

}

