export default class Ready {

  constructor(g) {
    this.g = g;

    this.mainText = g.H.mkFont(g, 4, 11);

    this.text = g.mobile ? 'TAP ME' : 'PRESS A KEY';
  }

  init() {}

  update(dt) {

    if (this.g.input.click) {
      this.g.changeState('Title');
    }

  }

  render() {
    const g = this.g;
    g.draw.clear(0);

    if (g.fader > 0) {
      g.draw.text(this.text, this.mainText, false, 120);
    }

  }

}


