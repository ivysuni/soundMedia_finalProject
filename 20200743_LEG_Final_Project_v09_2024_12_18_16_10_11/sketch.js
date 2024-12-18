let xsong, yuki, ill;
let currentSongTitle = "";

let btn1, btn2, btn3, sliderVol, sliderPan, sliderRate;
let jumpButton1, jumpButton2, psButton;
let amp;

let rotationGradient;
const noOfStars = 10000,
  sizeDiff = 0.07,
  majorAxisMinLen = 3,
  widthHeightRatio = 0.7;
const stars = [];

var fft;
var smoothing = 0.8;
var binCount = 1024;
var particles = new Array(binCount * 1.5);

let word = "Click!!!";
let posX, posY;
let targetPosX, targetPosY;
let lerpFactor = 0.1;

let textArray = ["🥶", "🎄", "🎁", "🐺", "⛄", "❄️"];
let texts = [];


function preload() {
  soundFormats("mp3", "ogg");
  xsong = loadSound("ChristmasSong.mp3");
  yuki = loadSound("Yukiakari.mp3");
  ill = loadSound("illumination.mp3");
}

function setup() {
  createCanvas(640, 1280);
  amp = new p5.Amplitude();

  posX = width / 2;
  posY = height / 2;
  targetPosX = mouseX;
  targetPosY = mouseY;

  rotationGradient = PI / noOfStars;

  for (let i = 0; i < noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i * sizeDiff;
    stars.push(new Star(majorAxisLen));
  }

  createButtonUI();
  createSliders();

  fft = new p5.FFT(smoothing, binCount);

  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(-height, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }
}

function draw() {
  background("black");

  // Star Layer
  push();
  translate(width / 2, height / 2 - 130);
  let ampLevel = amp.getLevel() * 20000;
  let rotationFactor = map(
    amp.getLevel() / 15,
    amp.getLevel() / 15,
    amp.getLevel() * 15,
    amp.getLevel() * 15,
    PI
  );
  let starCount = constrain(int(ampLevel * 3), 100, noOfStars); // 은하 밀도, 사이즈

  for (let i = 0; i < starCount; i++) {
    let rotationFactor = map(amp.getLevel(), 0, 1, 0, PI);

    if (!isNaN(rotationFactor)) {
      rotate(
        i < starCount / 2 ? rotationFactor / starCount : (rotationFactor * 7) / starCount
      );
    }
    stars[i].update(ampLevel);
    stars[i].display();
  }
  pop();

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

  push();
  targetPosX = constrain(mouseX, 0, width - textWidth(word));
  targetPosY = constrain(mouseY, 0, height - textDescent());

  posX = lerp(posX, targetPosX + 20, lerpFactor);
  posY = lerp(posY, targetPosY, lerpFactor);

  textAlign(LEFT, TOP);
  textSize(18);
  if (mouseIsPressed) {
    text("🎄X-MAS!!!🎄", posX, posY);
  } else {
    text(word, posX, posY);
  }
  for (let i = texts.length - 1; i >= 0; i--) {
    let textObj = texts[i];
    textSize(textObj.size);
    textAlign(CENTER, CENTER);
    text(textObj.text, textObj.x, textObj.y);

    textObj.y += 5;

    if (textObj.y > height) {
      texts.splice(i, 1);
    }
  }
  pop();

  displayUI();
  displayCurrentSongTitle();
}

function displayStars() {
  let ampLevel = amp.getLevel() * 20000;

  let starCount = constrain(int(ampLevel), 100, noOfStars);
  for (let i = 0; i < starCount; i++) {
    rotate(
      i < starCount / 2 ? rotationFactor / starCount : (rotationFactor * 3) / starCount
    );
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

  update(ampLevel) {
    this.deltaTheta = 0.01 + ampLevel * 0.05;
    this.theta += this.deltaTheta;
  }
}

class Particle {
  constructor(position) {
    this.position = position;
    this.scale = random(0, 0.1);
    this.speed = createVector(0, random(0, 10));
    this.color = [255, 255, 255, random(0, 255)];
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

function mousePressed() {
  let randomText = textArray[floor(random(textArray.length))];
  let randomSize = random(23, 35);
  let textObj = {
    text: randomText,
    x: mouseX,
    y: mouseY,
    size: randomSize
  };
  texts.push(textObj);
}

function createButtonUI() {
  const buttonLabels = ["Christmas Song", "Yukiakari", "illumination"];
  const buttonActions = [
    () => toggleMusic(xsong, btn1),
    () => toggleMusic(yuki, btn2),
    () => toggleMusic(ill, btn3),
  ];

  [btn1, btn2, btn3] = buttonLabels.map((label, idx) => {
    let btn = createButton(label);
    btn.size(134, 23);
    styleButton(btn);
    btn.position(103 + idx * 150, 1200);
    btn.mousePressed(buttonActions[idx]);
    return btn;
  });

  jumpButton1 = createButton("<<");
  jumpButton1.size(30, 23);
  jumpButton1.position(270, 1100);
  jumpButton1.mousePressed(() => jumpSong(-0.2));

  jumpButton2 = createButton(">>");
  jumpButton2.size(30, 23);
  jumpButton2.position(338, 1100);
  jumpButton2.mousePressed(() => jumpSong(0.2));

  psButton = createButton("▶");
  psButton.size(30, 23);
  psButton.position(304, 1100);
  psButton.mousePressed(toggleRandomPlayPause);
}

function createSliders() {
  sliderVol = createSlider(0, 4, 1, 0.1).position(103, 1170);
  sliderPan = createSlider(-1, 1, 0, 0.1).position(253, 1170);
  sliderRate = createSlider(0, 2, 1, 0.1).position(403, 1170);
}

function styleButton(btn) {
  btn.style("background", "white");
  btn.style("font-size", "16px");
  btn.style("border-radius", "14px");
  btn.style("border-width", "0px");
}

function displayUI() {
  textSize(15);
  fill("white");
  text("vol", 170, 1160);
  text("L                 R", 320, 1160);
  text("speed", 465, 1160);
  text("+ 20%", 398, 1117);
  text("- 20%", 240, 1117);

  setMusicProperties(xsong, btn1, "Christmas Song");
  setMusicProperties(yuki, btn2, "Yukiakari");
  setMusicProperties(ill, btn3, "illumination");
}

function displayCurrentSongTitle() {
  fill("white");
  textSize(20);
  textAlign(CENTER);

  let currentSongTitle = "";
  if (xsong.isPlaying()) {
    currentSongTitle = "🎄Christmas Song - Back Number🎄";
  } else if (yuki.isPlaying()) {
    currentSongTitle = "🐺Yukiakari - &TEAM🐺";
  } else if (ill.isPlaying()) {
    currentSongTitle = "🐺illumination - &TEAM🐺";
  }
  text(currentSongTitle, width / 2, 1070);
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
  [btn1, btn2, btn3].forEach((btn) => {
    if (btn !== activeButton && btn.html() !== "STOP") {
      btn.html(btn.elt.textContent.split(" ")[0]);
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
  sounds.forEach((sound) => {
    if (sound.isPlaying()) {
      sound.pause();
    }
  });
}

function updateButtonLabel(activeSound) {
  if (activeSound === xsong) btn1.html("STOP");
  else if (activeSound === yuki) btn2.html("STOP");
  else if (activeSound === ill) btn3.html("STOP");
}

function toggleMusic(sound, button) {
  if (!sound.isPlaying()) {
    stopAllMusic();
    sound.play();
    button.html("STOP");
  } else {
    sound.stop();
    button.html(button.elt.textContent.split(" ")[0]);
  }
}

function toggleRandomPlayPause() {
  const sounds = [xsong, yuki, ill];

  if (psButton.html() === "▶") {
    stopAllMusic();
    resetButtons(null);

    let randomSound = random(sounds);
    randomSound.play();

    updateButtonLabel(randomSound);
    currentSongTitle = getSongTitle(randomSound);
    psButton.html("❚❚");
  } else {
    pauseAllMusic();
    psButton.html("▶");
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
  sounds.forEach((sound) => {
    if (sound && sound.isPlaying()) {
      const currentTime = sound.currentTime();
      const duration = sound.duration();
      if (
        currentTime !== undefined &&
        duration !== undefined &&
        duration - currentTime > 1
      ) {
        const newTime = constrain(
          currentTime + percentage * duration,
          0,
          duration
        );
        sound.jump(newTime);
      }
    }
  });
}
