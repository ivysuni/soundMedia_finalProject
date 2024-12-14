let xsong, eve, ill;
let btn1, btn2, btn3;
let slider1;
let sliderPan;
let sliderRate;

var jumpButton1;
var jumpButton2;
let jumpV;

let amp;
let vol;

let rotationGradient;
let rotationGradientSlider;
let noOfStars = 10000, sizeDiff = 0.1, majorAxisMinLen = 10, widthHeightRatio = 0.7;
let stars = [];

function preload(){
  soundFormats('mp3', 'ogg');
  xsong = loadSound('ChristmasSong.mp3');
  eve = loadSound('ChristmasEve.mp3');
  ill = loadSound('illumination.mp3');
}

function setup() {
  createCanvas(640, 640);
  amp = new p5.Amplitude();

  rotationGradient = PI / noOfStars;
  rotationGradientSlider = createSlider(0, rotationGradient * 10, rotationGradient * 3, rotationGradient / 100);

  for (let i = 0; i < noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i * sizeDiff;
    stars.push(new Star(majorAxisLen));
  }
  
  btn1 = createButton('Christmas Song');
  btn1.size(134, 23);
  btn1.style("background", "white");
  btn1.style("font-size", "16px");
  btn1.style("border-radius", "14px");
  btn1.style("border-width", "0px");
  btn1.position(103, 550);
  btn1.mousePressed(playMusic);

  btn2 = createButton('Christmas Eve');
  btn2.size(134, 23);
  btn2.style("background", "white");
  btn2.style("font-size", "16px");
  btn2.style("border-radius", "14px");
  btn2.style("border-width", "0px");
  btn2.position(width / 2 - btn2.width / 2, 550);
  btn2.mousePressed(playMusic2);
  
  btn3 = createButton('illumination');
  btn3.size(134, 23);
  btn3.style("background", "white");
  btn3.style("font-size", "16px");
  btn3.style("border-radius", "14px");
  btn3.style("border-width", "0px");
  btn3.position(403, 550);
  btn3.mousePressed(playMusic3);
  
  vol = 1.0;
  
  slider = createSlider(0, 2, 1, 0.1);
  sliderPan = createSlider(-1, 1, 0, 0.1);
  sliderRate = createSlider(0, 2, 1, 0.1);
  
  jumpButton1 = createButton('<<');
  jumpButton1.mousePressed(jumpSong2);
  
  jumpButton2 = createButton('>>');
  jumpButton2.mousePressed(jumpSong1);
  
  jumpV = 0;
}

function draw() {
  background('black');
  
  noFill();
  stroke('white');
  
  let ampLevel = amp.getLevel() * 20000;
  console.log('Amplitude Level:', ampLevel);

  translate(width / 2, height / 2 - 30);
  
  xsong.setVolume(vol);
  eve.setVolume(vol);
  ill.setVolume(vol);
  vol = slider.value();
  xsong.pan(sliderPan.value());
  xsong.rate(sliderRate.value());
  eve.pan(sliderPan.value());
  eve.rate(sliderRate.value());
  ill.pan(sliderPan.value());
  ill.rate(sliderRate.value());
  console.log(slider.value());
  console.log(xsong.duration());
  console.log(eve.duration());
  console.log(ill.duration());
  
  
  noOfStars = constrain(int(ampLevel), 100, 10000);
  
  for (let i = 0; i < noOfStars; i++) {    
    rotate(rotationGradientSlider.value());
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

function playMusic() {
  if (!xsong.isPlaying()) {
    xsong.play();
    if (eve.isPlaying()) { eve.stop(); }
    if (ill.isPlaying()) { ill.stop(); }
    btn1.html('STOP');
    btn2.html('Christmas Eve');
    btn3.html('illumination');
  } else {
    xsong.stop();
    btn1.html('Christmas Song');
  }
}

function playMusic2() {
  if (!eve.isPlaying()) {
    eve.play();
    if (xsong.isPlaying()) { xsong.stop(); }
    if (ill.isPlaying()) { ill.stop(); }
    btn2.html('STOP');
    btn1.html('Christmas Song');
    btn3.html('illumination');
  } else {
    eve.stop();
    btn2.html('Christmas Eve');
  }
}

function playMusic3() {
  if (!ill.isPlaying()) {
    ill.play();
    if (xsong.isPlaying()) { xsong.stop(); }
    if (eve.isPlaying()) { eve.stop(); }
    btn3.html('STOP');
    btn1.html('Christmas Song');
    btn2.html('Christmas Eve');
  } else {
    ill.stop();
    btn3.html('illumination');
  }
}

function jumpSong1(){ // 각 노래 수치에 맞게 조정해야 함...
  jumpV = jumpV + 19.0272;
  if(jumpV + 19.0272 >= 190.272){
    jumpV = 190.272;
  }
  xsong.jump(jumpV);
  eve.jump(jumpV);
  ill.jump(jumpV);
  
  // console.log(jumpV);
}


function jumpSong2(){ // 각 노래 수치에 맞게 조정해야 함...
  jumpV = jumpV - 19.0272;
  if(jumpV <= 19.0272){
    jumpV = 0;
  }
  xsong.jump(jumpV);
  eve.jump(jumpV);
  ill.jump(jumpV);
}

