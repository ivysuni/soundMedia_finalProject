let xsong, yuki, ill;
let currentSongTitle = "";

let btn1, btn2, btn3, sliderVol, sliderPan, sliderRate;
let jumpButton1, jumpButton2, psButton;
let amp;

let rotationGradient;
const noOfStars = 10000, sizeDiff = 0.1, majorAxisMinLen = 10, widthHeightRatio = 0.7;
const stars = [];

var fft;
var smoothing = 0.8; // FFT smoothing 값
var binCount = 1024; // FFT 배열 크기
var particles = new Array(binCount);

function preload() {
  soundFormats('mp3', 'ogg');
  xsong = loadSound('ChristmasSong.mp3');
  yuki = loadSound('Yukiakari.mp3');
  ill = loadSound('illumination.mp3');
}

function setup() {
  createCanvas(640, 1280);
  amp = new p5.Amplitude();
  rotationGradient = PI / noOfStars;

  for (let i = 0; i < noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i * sizeDiff;
    stars.push(new Star(majorAxisLen));
  }

  createButtonUI();
  createSliders();
  
  fft = new p5.FFT(smoothing, binCount);
  // fft.setInput(random(sounds));

  // Particle 인스턴스 초기화
  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(0, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function draw() {
  background('black');

  // Star Layer
  push();
  translate(width / 2, height / 2 - 350);
  let ampLevel = amp.getLevel() * 20000;
  let rotationFactor = map(mouseX, mouseX, width, mouseX, PI);

  let starCount = constrain(int(ampLevel), 100, noOfStars);
  for (let i = 0; i < starCount; i++) {
    stars[i].display();
    stars[i].update();
  }
  pop();

  // FFT Particle Layer
  push();
  translate(0, 0);
  var spectrum = fft.analyze(binCount);

  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

    particles[i].update(thisLevel);
    particles[i].show();
  }
  // particles[i].showWithBlur(0.1);
  pop();

  displayUI();
  displayCurrentSongTitle();
}

function displayStars() {
  let ampLevel = amp.getLevel() * 20000;
  let rotationFactor = map(mouseX, mouseX, mouseY, mouseY, PI);

  let starCount = constrain(int(ampLevel), 100, noOfStars);
  for (let i = 0; i < starCount; i++) {
    rotate(i < starCount / 2 ? rotationFactor / starCount : (rotationFactor * 3) / starCount);
    stars[i].display();
    stars[i].update();
  }
}

function displayFFTParticles() {
  // FFT 기반 파티클 그리기
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

  update(r) {
    this.theta += this.deltaTheta;
  }
}

class Particle {
  constructor(position) {
    this.position = position;
    this.scale = random(0, 0.1);
    this.speed = createVector(0, random(0, 10));
    this.color = [random(255, 255), random(255, 255), random(255, 255), random(0, 255)];
  }

  update(someLevel) {
    this.position.y += this.speed.y / (someLevel * 2 + 0.1);
    if (this.position.y > height) {
      this.position.y = 0;
    }
    this.diameter = map(someLevel, 0, 1, 0, 130) * this.scale;
  }

  show() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
  }
}

function createButtonUI() {
  const buttonLabels = ['Christmas Song', 'Yukiakari', 'illumination'];
  const buttonActions = [() => toggleMusic(xsong, btn1), () => toggleMusic(yuki, btn2), () => toggleMusic(ill, btn3)];

  [btn1, btn2, btn3] = buttonLabels.map((label, idx) => {
    let btn = createButton(label);
    btn.size(134, 23);
    styleButton(btn);
    btn.position(103 + idx * 150, 790);
    btn.mousePressed(buttonActions[idx]);
    return btn;
  });

  jumpButton1 = createButton('<<');
  jumpButton1.size(30, 23);
  jumpButton1.position(270, 710);
  jumpButton1.mousePressed(() => jumpSong(-0.2));

  jumpButton2 = createButton('>>');
  jumpButton2.size(30, 23);
  jumpButton2.position(338, 710);
  jumpButton2.mousePressed(() => jumpSong(0.2));
  
  psButton = createButton('▶');
  psButton.size(30, 23);
  psButton.position(304, 710);
  psButton.mousePressed(toggleRandomPlayPause);
}

function createSliders() {
  sliderVol = createSlider(0, 4, 1, 0.1).position(103, 765);
  sliderPan = createSlider(-1, 1, 0, 0.1).position(253, 765);
  sliderRate = createSlider(0, 2, 1, 0.1).position(403, 765);
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
  text("vol", 170, 760);
  text("L                 R", 320, 760);
  text("speed", 465, 760);

  setMusicProperties(xsong, btn1, 'Christmas Song');
  setMusicProperties(yuki, btn2, 'Yukiakari');
  setMusicProperties(ill, btn3, 'illumination');
}

function displayCurrentSongTitle() {
  fill('white');
  textSize(20);
  textAlign(CENTER);
  
  let currentSongTitle = '';
  if (xsong.isPlaying()) {
    currentSongTitle = 'Christmas Song - Back Number';
  } else if (yuki.isPlaying()) {
    currentSongTitle = 'Yukiakari - &TEAM';
  } else if (ill.isPlaying()) {
    currentSongTitle = 'illumination - &TEAM';
  }
  text(currentSongTitle, width / 2, height / 2 + 50);
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
    if (btn !== activeButton && btn.html() !== 'STOP') {
      btn.html(btn.elt.textContent.split(' ')[0]);
    }
  });
}

function stopAllMusic() {
  if (xsong.isPlaying()) xsong.stop();
  if (yuki.isPlaying()) yuki.stop();
  if (ill.isPlaying()) ill.stop();
}

function pauseAllMusic() {
  const sounds = [xsong, yuki, ill];
  sounds.forEach(sound => {
    if (sound.isPlaying()) {
      sound.pause();
    }
  });
}

function updateButtonLabel(activeSound) {
  if (activeSound === xsong) btn1.html('STOP');
  else if (activeSound === yuki) btn2.html('STOP');
  else if (activeSound === ill) btn3.html('STOP');
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

function toggleRandomPlayPause() {
  const sounds = [xsong, yuki, ill];

  if (psButton.html() === '▶') {
    stopAllMusic();
    resetButtons(null);

    let randomSound = random(sounds);
    randomSound.play();

    updateButtonLabel(randomSound);
    currentSongTitle = getSongTitle(randomSound);
    psButton.html('❚❚');
  } else {
    pauseAllMusic();
    psButton.html('▶');
    currentSongTitle = "";
    resetButtons(null);
  }
}

function getSongTitle(sound) {
  if (sound === xsong) return "Christmas Song";
  if (sound === yuki) return "Yukiakari";
  if (sound === ill) return "illumination";
  return "";
}

function jumpSong(percentage) {
  const sounds = [xsong, yuki, ill];
  sounds.forEach(sound => {
    if (sound && sound.isPlaying()) {
      const currentTime = sound.currentTime();
      const duration = sound.duration();
      if (currentTime !== undefined && duration !== undefined && duration - currentTime > 1) {
        const newTime = constrain(currentTime + percentage * duration, 0, duration);
        sound.jump(newTime);
      }
    }
  });
}
