export default class Title {

  constructor(g) {
    this.g = g;
    this.bat = this.g.spawn('Bat', {p: this, x: 100, y: 445, s: 2  });
    this.bat = this.g.spawn('Bat', {p: this, x: 200, y: 200  });

    this.mainText = g.H.mkFont(g, 6, 11);
    this.mainShadow = g.H.mkFont(g, 6, 0);
    this.startText = g.H.mkFont(g, 2, 2);

    this.canSwitch = false;

    this.text = g.mobile ? 'TAP TO START' : 'L OR R ARROW TO START'
    this.bga = 0;
  }

  init() { 
    this.setThunder();
    this.g.addEvent({
      t: 75,
      cb: () => {
        this.canSwitch = true;
      }
    })
  }

  setThunder() {
    this.g.addEvent({
      t: this.g.H.rnd(200,500),
      cb: () => {
        this.bga = 1;
        this.g.sfxPlay('thunder');
        this.setThunder();
      }
    });
  }

  update(dt) {
    const g = this.g;
    g.ents.forEach((e) => {
      e.update(dt);
    }); 

    if (this.bga > 0) {
      this.bga -= dt;
    }
    if (this.bga < 0) {
      this.bga = 0;
    }

    const i = g.input;
    if (i.click && this.canSwitch) {
      g.changeState('Play');
    }
    i.click = false;
  }

  render() {
    const g = this.g;
    g.draw.clear(12);

    if (this.bga) {
      g.draw.rect(0, 0, g.w, g.h, 2, this.bga);
    }

    g.draw.circle(230, 70, 40, 2);

    this.drawTower();

    g.draw.rect(0, g.h - 10, g.w, g.h, 3);

    g.draw.text(g.data.title, this.mainShadow, false, 156);
    g.draw.text(g.data.title, this.mainText, false, 150);

    this.g.ents.forEach((e) => {
      e.render();
    });

    g.draw.triangle(90, 70, 100, 50, 19);
    g.draw.triangle(90, 70, 100, 50, 0, 0.1);

    if (g.fader > 0) {
      g.draw.text(this.text, this.startText, false, 400);
    }
  }


  drawTower() {

    const g = this.g;
    g.draw.rect(90, 70, 100, g.h, 19);
     g.draw.rect(120, g.h - 40, 20, g.h, 0);


    g.draw.img(g.imgs.brick1, 100, 100, 8, 0.1);
    g.draw.img(g.imgs.brick1, 142, g.h/2, 6, 0.1);
    g.draw.img(g.imgs.brick2, g.w/3, g.h/3, 10, 0.1);
    g.draw.img(g.imgs.brick2, g.w/3, 300, 10, 0.1);


  }

}
