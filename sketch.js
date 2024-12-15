let xsong, yuki, ill;
let btn1, btn2, btn3, sliderVol, sliderPan, sliderRate;
let jumpButton1, jumpButton2;
let amp;

let rotationGradient;
const noOfStars = 10000, sizeDiff = 0.1, majorAxisMinLen = 10, widthHeightRatio = 0.7;
const stars = [];

function preload() {
  soundFormats('mp3', 'ogg');
  xsong = loadSound('ChristmasSong.mp3');
  yuki = loadSound('Yukiakari.mp3');
  ill = loadSound('illumination.mp3');
}

function setup() {
  createCanvas(640, 640);
  amp = new p5.Amplitude();
  rotationGradient = PI / noOfStars;

  for (let i = 0; i < noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i * sizeDiff;
    stars.push(new Star(majorAxisLen));
  }

  createButtonUI();
  createSliders();
}

function draw() {
  background('black');
  displayUI();

  let ampLevel = amp.getLevel() * 20000;
  let rotationFactor = map(mouseX, 0, width, 0, PI);

  translate(width / 2, height / 2 - 30);

  let starCount = constrain(int(ampLevel), 100, noOfStars);
  for (let i = 0; i < starCount; i++) {
    rotate(i < starCount / 2 ? rotationFactor / starCount : (rotationFactor * 3) / starCount);
    stars[i].display();
    stars[i].update();
  }
}

class Star {
  constructor(majorAxisLen) {
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2 * PI);
    this.deltaTheta = 0.01;
  }

  display() {
    const x = (this.majorAxisLen / 2) * cos(this.theta);
    const y = (this.minorAxisLen / 2) * sin(this.theta);
    noStroke();
    fill(255, 255, 255, 100);
    circle(x, y, 2);
  }

  update() {
    this.theta += this.deltaTheta;
  }
}

function createButtonUI() {
  const buttonLabels = ['Christmas Song', 'Yukiakari', 'illumination'];
  const buttonActions = [() => toggleMusic(xsong, btn1), () => toggleMusic(yuki, btn2), () => toggleMusic(ill, btn3)];

  [btn1, btn2, btn3] = buttonLabels.map((label, idx) => {
    let btn = createButton(label);
    btn.size(134, 23);
    styleButton(btn);
    btn.position(103 + idx * 150, 590);
    btn.mousePressed(buttonActions[idx]);
    return btn;
  });

  jumpButton1 = createButton('<<');
  jumpButton1.position(280, 510);
  jumpButton1.mousePressed(() => jumpSong(-0.2));

  jumpButton2 = createButton('>>');
  jumpButton2.position(328, 510);
  jumpButton2.mousePressed(() => jumpSong(0.2));
}

function createSliders() {
  sliderVol = createSlider(0, 2, 1, 0.1).position(103, 565);
  sliderPan = createSlider(-1, 1, 0, 0.1).position(253, 565);
  sliderRate = createSlider(0, 2, 1, 0.1).position(403, 565);
}

function styleButton(btn) {
  btn.style("background", "white");
  btn.style("font-size", "16px");
  btn.style("border-radius", "14px");
  btn.style("border-width", "0px");
}

function displayUI() {
  textSize(15);
  fill('white');
  text("vol", 158, 560);
  text("L                 R", 265, 560);
  text("speed", 446, 560);

  setMusicProperties(xsong, btn1, 'Christmas Song');
  setMusicProperties(yuki, btn2, 'Yukiakari');
  setMusicProperties(ill, btn3, 'illumination');
}

function setMusicProperties(sound, button, label) {
  sound.setVolume(sliderVol.value());
  sound.pan(sliderPan.value());
  sound.rate(sliderRate.value());

  if (!sound.isPlaying() && button.html() !== label) {
    button.html(label);
  }
}

function resetButtons(activeButton) {
  [btn1, btn2, btn3].forEach(btn => {
    if (btn !== activeButton) btn.html(btn.elt.textContent.split(' ')[0]);
  });
}


function stopAllMusic() {
  if (xsong.isPlaying()) xsong.stop();
  if (yuki.isPlaying()) yuki.stop();
  if (ill.isPlaying()) ill.stop();
}

function toggleMusic(sound, button) {
  if (!sound.isPlaying()) {
    stopAllMusic();
    sound.play();
    button.html('STOP');
  } else {
    sound.stop();
    button.html(button.elt.textContent.split(' ')[0]);
  }
}

function jumpSong(percentage) {
  const sounds = [xsong, yuki, ill];
  sounds.forEach(sound => {
    if (sound && sound.isPlaying()) {
      const currentTime = sound.currentTime();
      const duration = sound.duration();
      if (currentTime !== undefined && duration !== undefined && duration - currentTime > 1) { // 추가된 조건
        const newTime = constrain(currentTime + percentage * duration, 0, duration);
        sound.jump(newTime);
      }
    }
  });
}
