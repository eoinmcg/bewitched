export default function Input(canvas, g) {

  let l = window.addEventListener;
  let s = this;

  this.c = canvas;
  this.g = g;
  this.click = 0;

  this.keys = { l: 0, r: 0 };

  this.resetKeys = () => {
    this.keys = { l: 0, r: 0, click: false };
  }

  l('keydown', (e) => {
    switch (e.keyCode) {
      case 39: this.keys.r = 1; break;
      case 37: this.keys.l = 1; break;
    }
    this.click = true;
  });

  l('keyup', (e) => {
    switch (e.keyCode) {
      case 39: this.keys.r = 0; break;
      case 37: this.keys.l = 0; break;
    }
    this.click = false;
  });

  l('touchstart', (e) => {
    this.trackTouch(e.touches);
  });

  l('touchmove', (e) => {
    this.trackTouch(e.touches);
  });

  l('touchend', (e) => {
    this.trackTouch(e.touches);
    this.resetKeys();
  });

  this.trackTouch = (touches) => {

    let c = this.c,
      offsetX = c.offsetLeft,
      scale = parseInt(c.style.width, 10) / c.width;

    if (!touches || !touches[0]) return;
    const x = ~~(touches[0].pageX - offsetX) / scale;

    this.click = true;
    if (x < c.width / 2) {
      this.keys.l = 1;
    } else {
      this.keys.r = 1;
    }
  };
}
