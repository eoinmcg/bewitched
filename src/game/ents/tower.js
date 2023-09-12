import data from '../data/levels.json';

export default class Tower {

  constructor(p) {
    this.level = 1;
    this.p = p;
    this.g = p.g;
  }

  init(level) {

    this.level = level;
    const pad_array = function(arr,len,fill) {
      return arr.concat(Array(len).fill(fill)).slice(0,len);
    }

    this.fin = false;
    let d = data[level];
    if(!d) {
      this.complete = true;
      return;
    }
    this.n = d.n;
    this.bg = d.bg;
    this.h = d.h * this.g.h;
    d.data.forEach((line) => {
      let p = line.split('-');
      p.forEach((v, i) => {
         if (i) { p[i] = ~~(v); }
      });
      switch (p[0]) {
        case 'B':
            this.g.spawn('Bat', {p: this.p, x: ~~(p[1]), y: ~~(p[2])});
          break;
        case 'S':
            this.g.spawn('Spitter', {p: this.p, x: ~~(p[1]), y: ~~(p[2])});
          break;
        case 'X':
            this.g.spawn('Spike', {p: this.p, x: ~~(p[1]), y: ~~(p[2])});
          break;
        case 'L':
          p = pad_array(p, 10, 0);
          let l = {
            p: this.p,
            x: p[1], y: p[2],
            w: p[3], vx: p[4], vy: p[5],
            col: p[6] || d.l, b: p[7]
          }
          this.g.spawn('Ledge', l);
          break;
        default:
          break;
      }
    });
  }
}
