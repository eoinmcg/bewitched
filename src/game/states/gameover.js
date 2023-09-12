export default class Gameover {

  constructor(g) {
    this.g = g;

    this.mainText = g.H.mkFont(g, 6, 2);
    this.canSwitch = false;

    this.o = 0;

  }

  init() { 
    this.g.addEvent({
      t: 100,
      cb: () => {
        this.canSwitch = true;
        this.g.sfxPlay('gameover');
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
    g.draw.clear(3);
    g.draw.rect(0, 0, g.w, g.h, 0, this.o);

    if (g.fader > 0) {
      g.draw.text('GAME', this.mainText, false, 100);
      g.draw.text('OVER', this.mainText, false, 150);
    }

    g.draw.img(g.imgs.skull, 120, 240, 14, 0.2);

    this.g.ents.forEach((e) => {
      e.render();
    });

  }

}
