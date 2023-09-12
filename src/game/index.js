import Game from './engine/game';
import Data from './data/base';

import Ready from './states/ready';
import Title from './states/title';
import Play from './states/play';
import Gameover from './states/gameover';
import Win from './states/win';


import Sprite from './ents/sprite';
import Witch from './ents/witch';
import Ledge from './ents/ledge';
import Bat from './ents/bat';
import Biter from './ents/biter';
import Spitter from './ents/spitter';
import Spike from './ents/spike';
import Fireball from './ents/fireball';
import Firefly from './ents/firefly';
import Spider from './ents/spider';
import Demon from './ents/demon';
import Cat from './ents/cat';
import Door from './ents/door';
import Boom from './ents/boom';
import Particle from './ents/particle';
import Spark from './ents/spark';
import Text from './ents/text';

import Sfx from '../lib/zzfx';

const o = Data;
o.states = { Ready, Title, Play, Gameover, Win };
o.ents = { Sprite, Witch, Ledge, Bat, Biter, Spitter, Spike, Fireball, Firefly, Demon, Cat, Spider, Door, Boom, Particle, Spark, Text };
o.Sfx = Sfx;

new Game(o).init();


