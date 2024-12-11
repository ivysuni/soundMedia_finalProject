let noOfStars = 40, sizeDiff = 10, majorAxisMinLen = 10, widthHeightRatio = 0.7, rotationGradient, rotationGradientSlider;

function setup() {
  createCanvas(640, 640);
  rotationGradient = PI/noOfStars;
  rotationGradientSlider = createSlider(-0.2, 0.2, rotationGradient, 0.01)
}

function draw() {
  background(0);
  
  noFill();
  stroke(255);
  
  translate(width/2, height/2);
  
  for(let i=0; i<noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i*sizeDiff;
    const minorAxisLen = majorAxisLen * widthHeightRatio;
    
    rotate(rotationGradientSlider.value());
    
    ellipse(0, 0, majorAxisLen, minorAxisLen);
  }
}