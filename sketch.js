var dimension;

var black = 0;
var white = 255;

var buttons = [];

var instruments = [];
var sounds = [];
var images = [];

var playButton;
var playSymbol;

var hasWon = false;
var hasLost = false;

var level = 0;

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

class Button {
  constructor(b) {
    this.pos = b;
    this.hover = false;
    this.press = false;
    this.instrument = -1;

    this.button = new Clickable();
    this.button.color = white;
    this.button.cornerRadius = 0;
    this.button.text = '';

    let button = this;

    this.button.onHover = function() {
      if(!button.hover) {
        button.hover = true;
        cursor(HAND);
      }
    }

    this.button.onOutside = function() {
      if(button.hover) {
        button.hover = false;
        button.press = false;
        cursor(ARROW);
      }
    }

    this.button.onPress = function() {
      button.press = true;
    }

    this.button.onRelease = function() {
      button.press = false;
      checkAnswer(button.instrument);
    }

    this.update();
  }

  setInstrument(i) {
    this.instrument = i;
    this.version = floor(random(images[this.instrument].length));
  }

  update() {
    let x = this.pos%2;
    let y = floor(this.pos/2);
    let w = dimension/2.1;
    let h = 5*w/8;
    let margin = 0.01*dimension;
    this.button.locate(width/2+(x-1)*w+margin,
                       height/2+(y-1)*h+margin);
    this.button.width = w-2*margin;
    this.button.height = h-2*margin;
    this.button.strokeWeight = 0;
  }

  draw() {
    this.button.draw();
    let x = this.button.x;
    let y = this.button.y;
    let w = this.button.width;
    let h = this.button.height;
    if(this.instrument >= 0) {
      image(images[this.instrument][this.version],x,y,w,h);
      if(this.press) {
        fill(white);
        rect(x,y,w,h);
      }
      else if(this.hover) {
        erase(180,0);
        rect(x,y,w,h);
        noErase();
      }
      if(this.press || this.hover) {
        fill(black);
        textFont(fontL);
        textSize(0.05*dimension);
        textAlign(CENTER);
        text(instruments[this.instrument],x+w/2,y+h/2-0.007*dimension);
      }
    }
    noFill();
    stroke(black);
    strokeWeight(0.003*dimension);
    rect(x,y,w,h);
  }
}

class PlayButton {
  constructor(b) {
    this.hover = false;
    this.press = false;
    this.instrument = -1;

    this.button = new Clickable();
    this.button.color = white;
    this.button.cornerRadius = 0;
    this.button.text = '';

    let button = this;

    this.button.onHover = function() {
      if(!button.hover) {
        button.hover = true;
        cursor(HAND);
      }
    }

    this.button.onOutside = function() {
      if(button.hover) {
        button.hover = false;
        button.press = false;
        cursor(ARROW);
      }
    }

    this.button.onPress = function() {
      button.press = true;
      button.playSound();
    }

    this.button.onRelease = function() {
      button.press = false;
    }

    this.update();
  }

  setInstrument(i) {
    this.instrument = i;
    this.version = floor(random(sounds[this.instrument].length));
    this.playSound();
  }

  playSound() {
    if(this.instrument >= 0) sounds[this.instrument][this.version].play();
  }

  update() {
    let x = width/2;
    let y = height/2+0.4*dimension;
    let w = 0.08*dimension;
    let h = w;
    this.button.locate(x-w/2,
                       y-h/2);
    this.button.width = w;
    this.button.height = h;
    this.button.strokeWeight = 0;
  }

  draw() {
    if(isMobile.any()) return;
    this.button.draw();
    let x = this.button.x;
    let y = this.button.y;
    let w = this.button.width;
    let h = this.button.height;
    image(playSymbol,x,y,w,h);
    if(this.press) {
      fill(white);
      rect(x,y,w,h);
    }
    else if(this.hover) {
      erase(180,0);
      rect(x,y,w,h);
      noErase();
    }
    if(this.press || this.hover) {
      fill(black);
      textFont(fontL);
      textSize(0.025*dimension);
      textAlign(CENTER);
      text('écouter',x+w/2,y+h/2-0.005*dimension);
    }
  }
}

function setInstruments() {
  stopSound();
  let i, i0, i1;
  i0 = 0;
  i1 = images.length;
  let same = true;
  for(let b = 0; b < 4; b++) {
    while(same) {
      i = floor(random(i0,i1));
      same = false;
      for(let oldB = 0; oldB < b; oldB++) {
        if(i == buttons[oldB].instrument) same = true;
      }
    }
    buttons[b].setInstrument(i);
    same = true;
  }

  i = buttons[floor(random(4))].instrument;
  playButton.setInstrument(i);

  hasWon = false;
  hasLost = false;
}

function stopSound() {
  if(playButton.instrument >= 0) sounds[playButton.instrument][playButton.version].stop();
}

function checkAnswer(i) {
  if(i == playButton.instrument) win();
  else loose();
}

function win() {
  hasWon = true;
}

function loose() {
  hasLost = true;
}

function preload() {
  fontM = loadFont('medium.otf');
  fontL = loadFont('light.otf');

  playSymbol = loadImage('play-symbol.png');

  soundFormats('mp3');

  let temp;

  temp = [];
  temp.push(loadSound('sounds/violon'));
  temp.push(loadSound('sounds/violon-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/violon-carrousel-01.jpg'));
  temp.push(loadImage('images/violon-carrousel-02.jpg'));
  temp.push(loadImage('images/violon-carrousel-03.jpg'));
  temp.push(loadImage('images/violon-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('violon');

  temp = [];
  temp.push(loadSound('sounds/violon-alto'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/violon-alto_carrousel-01.jpg'));
  temp.push(loadImage('images/violon-alto_carrousel-02.jpg'));
  temp.push(loadImage('images/violon-alto_carrousel-03.jpg'));
  temp.push(loadImage('images/violon-alto_carrousel-04.jpg'));
  temp.push(loadImage('images/violon-alto_carrousel-05.jpg'));
  images.push(temp);
  instruments.push('violon alto');

  temp = [];
  temp.push(loadSound('sounds/violoncelle'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/violoncelle-carrousel-01.jpg'));
  temp.push(loadImage('images/violoncelle-carrousel-02.jpg'));
  temp.push(loadImage('images/violoncelle-carrousel-03.jpg'));
  temp.push(loadImage('images/violoncelle-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('violoncelle');

  temp = [];
  temp.push(loadSound('sounds/contrebasse'));
  temp.push(loadSound('sounds/contrebasse-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/contrebasse-carrousel-01.jpg'));
  temp.push(loadImage('images/contrebasse-carrousel-02.jpg'));
  temp.push(loadImage('images/contrebasse-carrousel-03.jpg'));
  temp.push(loadImage('images/contrebasse-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('contrebasse');

  temp = [];
  temp.push(loadSound('sounds/guitare'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/guitare_carrousel-01.jpg'));
  temp.push(loadImage('images/guitare_carrousel-02.jpg'));
  temp.push(loadImage('images/guitare_carrousel-03.jpg'));
  images.push(temp);
  instruments.push('guitare');

  temp = [];
  temp.push(loadSound('sounds/guitare-elec'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/guitarer-elec-carrousel-01.jpg'));
  temp.push(loadImage('images/guitarer-elec-carrousel-02.jpg'));
  temp.push(loadImage('images/guitarer-elec-carrousel-03.jpg'));
  temp.push(loadImage('images/guitarer-elec-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('guitare électrique');

  temp = [];
  temp.push(loadSound('sounds/basse-elec'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/basse-elec-carrousel-01.jpg'));
  temp.push(loadImage('images/basse-elec-carrousel-02.jpg'));
  temp.push(loadImage('images/basse-elec-carrousel-03.jpg'));
  temp.push(loadImage('images/basse-elec-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('basse électrique');

  temp = [];
  temp.push(loadSound('sounds/harpe'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/harpe-carrousel-01.jpg'));
  temp.push(loadImage('images/harpe-carrousel-02.jpg'));
  temp.push(loadImage('images/harpe-carrousel-03.jpg'));
  temp.push(loadImage('images/harpe-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('harpe');

  temp = [];
  temp.push(loadSound('sounds/flute-bec'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/flute-bec-carrousel-01.jpg'));
  temp.push(loadImage('images/flute-bec-carrousel-02.jpg'));
  temp.push(loadImage('images/flute-bec-carrousel-03.jpg'));
  temp.push(loadImage('images/flute-bec-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('flûte à bec');

  temp = [];
  temp.push(loadSound('sounds/flute-trav'));
  temp.push(loadSound('sounds/flute-trav-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/flute-trav-carrousel-01.jpg'));
  temp.push(loadImage('images/flute-trav-carrousel-02.jpg'));
  temp.push(loadImage('images/flute-trav-carrousel-03.jpg'));
  temp.push(loadImage('images/flute-trav-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('flûte traversière');

  temp = [];
  temp.push(loadSound('sounds/clarinette'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/clarinette-carrousel-01.jpg'));
  temp.push(loadImage('images/clarinette-carrousel-02.jpg'));
  temp.push(loadImage('images/clarinette-carrousel-03.jpg'));
  temp.push(loadImage('images/clarinette-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('clarinette');

  temp = [];
  temp.push(loadSound('sounds/hautbois'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/hautbois-carrousel-01.jpg'));
  temp.push(loadImage('images/hautbois-carrousel-02.jpg'));
  temp.push(loadImage('images/hautbois-carrousel-03.jpg'));
  temp.push(loadImage('images/hautbois-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('hautbois');

  temp = [];
  temp.push(loadSound('sounds/basson'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/basson-carrousel-01.jpg'));
  temp.push(loadImage('images/basson-carrousel-02.jpg'));
  temp.push(loadImage('images/basson-carrousel-03.jpg'));
  temp.push(loadImage('images/basson-carrousel-04.jpg'));
  temp.push(loadImage('images/basson-carrousel-05.jpg'));
  images.push(temp);
  instruments.push('basson');

  temp = [];
  temp.push(loadSound('sounds/saxophone'));
  temp.push(loadSound('sounds/saxophone-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/saxophone-carrousel-01.jpg'));
  temp.push(loadImage('images/saxophone-carrousel-02.jpg'));
  temp.push(loadImage('images/saxophone-carrousel-03.jpg'));
  images.push(temp);
  instruments.push('saxophone');

  temp = [];
  temp.push(loadSound('sounds/trombone-coulisse'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/trombone-coulisse-carrousel-01.jpg'));
  temp.push(loadImage('images/trombone-coulisse-carrousel-02.jpg'));
  temp.push(loadImage('images/trombone-coulisse-carrousel-03.jpg'));
  temp.push(loadImage('images/trombone-coulisse-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('trombone');

  temp = [];
  temp.push(loadSound('sounds/trompette'));
  temp.push(loadSound('sounds/trompette-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/trompette-carrousel-01.jpg'));
  temp.push(loadImage('images/trompette-carrousel-02.jpg'));
  temp.push(loadImage('images/trompette-carrousel-03.jpg'));
  temp.push(loadImage('images/trompette-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('trompette');

  temp = [];
  temp.push(loadSound('sounds/tuba'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/tuba-carrousel-01.jpg'));
  temp.push(loadImage('images/tuba-carrousel-02.jpg'));
  temp.push(loadImage('images/tuba-carrousel-03.jpg'));
  temp.push(loadImage('images/tuba-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('tuba');

  temp = [];
  temp.push(loadSound('sounds/cor'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/cor-carrousel-01.jpg'));
  temp.push(loadImage('images/cor-carrousel-02.jpg'));
  temp.push(loadImage('images/cor-carrousel-03.jpg'));
  temp.push(loadImage('images/cor-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('cor');

  temp = [];
  temp.push(loadSound('sounds/chant'));
  temp.push(loadSound('sounds/chant-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/chant-carrousel-01.jpg'));
  temp.push(loadImage('images/chant-carrousel-02.jpg'));
  temp.push(loadImage('images/chant-carrousel-03.jpg'));
  temp.push(loadImage('images/chant-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('chant');

  temp = [];
  temp.push(loadSound('sounds/piano'));
  temp.push(loadSound('sounds/piano-jazz'));
  temp.push(loadSound('sounds/piano-elec-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/piano-carrousel-01.jpg'));
  temp.push(loadImage('images/piano-carrousel-02.jpg'));
  temp.push(loadImage('images/piano-carrousel-03.jpg'));
  temp.push(loadImage('images/piano-carrousel-04.jpg'));
  temp.push(loadImage('images/piano-carrousel-b-01.jpg'));
  temp.push(loadImage('images/piano-carrousel-b-02.jpg'));
  temp.push(loadImage('images/piano-carrousel-b-03.jpg'));
  temp.push(loadImage('images/piano-carrousel-b-04.jpg'));
  images.push(temp);
  instruments.push('piano');

  temp = [];
  temp.push(loadSound('sounds/clavecin'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/clavecin-carrousel-01.jpg'));
  temp.push(loadImage('images/clavecin-carrousel-02.jpg'));
  temp.push(loadImage('images/clavecin-carrousel-03.jpg'));
  temp.push(loadImage('images/clavecin-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('clavecin');

  temp = [];
  temp.push(loadSound('sounds/orgue'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/orgue-carrousel-01.jpg'));
  temp.push(loadImage('images/orgue-carrousel-02.jpg'));
  temp.push(loadImage('images/orgue-carrousel-03.jpg'));
  temp.push(loadImage('images/orgue-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('orgue');

  temp = [];
  temp.push(loadSound('sounds/accordeon'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/accordeon-carrousel-01.jpg'));
  temp.push(loadImage('images/accordeon-carrousel-02.jpg'));
  temp.push(loadImage('images/accordeon-carrousel-03.jpg'));
  temp.push(loadImage('images/accordeon-carrousel-04.jpg'));
  temp.push(loadImage('images/accordeon-carrousel-05.jpg'));
  images.push(temp);
  instruments.push('accordéon');

  temp = [];
  temp.push(loadSound('sounds/batterie'));
  temp.push(loadSound('sounds/batterie-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/batterie-carrousel-01.jpg'));
  temp.push(loadImage('images/batterie-carrousel-02.jpg'));
  temp.push(loadImage('images/batterie-carrousel-03.jpg'));
  temp.push(loadImage('images/batterie-carrousel-04.jpg'));
  temp.push(loadImage('images/batterie-carrousel-05.jpg'));
  images.push(temp);
  instruments.push('batterie');

  temp = [];
  temp.push(loadSound('sounds/timbales'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/timbales-carrousel-01.jpg'));
  temp.push(loadImage('images/timbales-carrousel-02.jpg'));
  temp.push(loadImage('images/timbales-carrousel-03.jpg'));
  temp.push(loadImage('images/timbales-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('timbales');

  temp = [];
  temp.push(loadSound('sounds/marimba'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/marimba-carrousel-01.jpg'));
  temp.push(loadImage('images/marimba-carrousel-02.jpg'));
  temp.push(loadImage('images/marimba-carrousel-03.jpg'));
  temp.push(loadImage('images/marimba-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('marimba');

  temp = [];
  temp.push(loadSound('sounds/vibraphone'));
  temp.push(loadSound('sounds/vibraphone-jazz'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/vibraphone-carrousel-01.jpg'));
  temp.push(loadImage('images/vibraphone-carrousel-02.jpg'));
  temp.push(loadImage('images/vibraphone-carrousel-03.jpg'));
  images.push(temp);
  instruments.push('vibraphone');

  temp = [];
  temp.push(loadSound('sounds/xylophone'));
  sounds.push(temp);
  temp = [];
  temp.push(loadImage('images/xylophone-carrousel-01.jpg'));
  temp.push(loadImage('images/xylophone-carrousel-02.jpg'));
  temp.push(loadImage('images/xylophone-carrousel-03.jpg'));
  temp.push(loadImage('images/xylophone-carrousel-04.jpg'));
  images.push(temp);
  instruments.push('xylophone');

  for(let i in sounds) {
    for(s in sounds[i]) {
      sounds[i][s].playMode('restart');
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  dimension = Math.min(width, height);

  for(let b = 0; b < 4; b++) {
    buttons.push(new Button(b));
  }

  playButton = new PlayButton();

  setInstruments();
}

function draw() {
  background(white);

  fill(black);
  textFont(fontM);
  textSize(0.075*dimension);
  textAlign(CENTER);
  text('Jeu des Instruments', width/2,height/2-0.4*dimension);

  if(hasWon) {
    textSize(0.05*dimension);
    text('Bravo !', width/2,height/2);
  }
  else if(hasLost) {
    textSize(0.05*dimension);
    text("Oups, c'est raté...", width/2,height/2);
  }
  else {
    for(let b = 0; b < 4; b++) {
      buttons[b].draw();
    }
  }

  playButton.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  dimension = Math.min(width, height);

  for(let b = 0; b < 4; b++) {
    buttons[b].update();
  }

  playButton.update();
}

function keyPressed() {
  switch(keyCode) {
    case 49:
    level = 0;
    setInstruments();
    break;
    case 50:
    level = 1;
    setInstruments();
    break;
    case 51:
    level = 2;
    setInstruments();
    break;
  }

  return false;
}
