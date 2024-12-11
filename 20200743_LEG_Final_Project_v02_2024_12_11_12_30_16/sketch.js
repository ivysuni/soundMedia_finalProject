let noOfStars = 4000, sizeDiff = 0.1, majorAxisMinLen = 10, widthHeightRatio = 0.7, rotationGradient, rotationGradientSlider, stars = [];

function setup() {
  createCanvas(640, 640);
  rotationGradient = PI/noOfStars;
  rotationGradientSlider = createSlider(0,rotationGradient*5, rotationGradient, rotationGradient/100);
  for(let i=0;i<noOfStars;i++) {
    const majorAxisLen = majorAxisMinLen + i*sizeDiff;
    stars.push(new Star(majorAxisLen));
  }
}

function draw() {
  background('black');
  
  noFill();
  stroke('white');

  translate(width/2, height/2)
  
  for(let i=0;i<noOfStars;i++) {    
    rotate(rotationGradientSlider.value())
    stars[i].display();
    stars[i].update();
  }
}

class Star {
  constructor(majorAxisLen) {
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2*PI);
    this.deltaTheta = 0.01
  }
  
  display() {
    const x = (this.majorAxisLen/2)*cos(this.theta)
    const y = (this.minorAxisLen/2)*sin(this.theta)
    
    noStroke();
    fill(255,255,255,100);
    circle(x, y, 2);
  }
  
  update() {
    this.theta += this.deltaTheta;
  }
}