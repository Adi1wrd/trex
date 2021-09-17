var trex, trex_running, edges, trexend;
var groundImage;
var ground;
var invisground;
var cloud, cloudImage; 
var obs1, obs2, obs3, obs4, obs5, obs6, obs;
var obsgroup, cloudgroup;
var PLAY=1;
var END=0;
var gamestate=PLAY;
var score = 0;
var restart, gameover, restartImage, gameoverImage;
var checkpoint, jump, die

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexend = loadAnimation("trex_collided.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("red.png")
  obs1 = loadImage("obstacle1.png")
  obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png")
  obs6 = loadImage("obstacle6.png")
  restartImage = loadImage("restart.png")
  gameoverImage = loadImage("gameOver.png")
  checkpoint = loadSound("checkpoint.mp3")
  jump = loadSound("jump.mp3")
  die = loadSound("die.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  // creating trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trexend)
  edges = createEdgeSprites();
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  //trex.debug = true
  trex.setCollider("circle",0,0,35)


  ground = createSprite(width/2, height-30, width, 20)
  ground.addImage(groundImage)


  invisground = createSprite(width/2, height-20, width, 10)
  invisground.visible = false

  obsgroup = new Group()
  cloudgroup = new Group()

  gameover = createSprite(width/2, height/2, 40, 40)
  gameover.addImage(gameoverImage)
  restart = createSprite(width/2, height/3, 20, 20)
  restart.addImage(restartImage)
  gameover.visible = false
  restart.visible = false
}


function draw(){
  //set background color 
  background("white");
if(gamestate === PLAY){

  ground.velocityX = -(2+5*score/100)
  if(ground.x<200) {
    ground.x = ground.width/2
  }
  score = score+ Math.round(getFrameRate()/60)
  if(score % 100 === 0) {
    checkpoint.play()
  }

  if(keyDown("space") && trex.y>height-70 || touches.length>0 && trex.y>height-70){
    trex.velocityY = -10;
    jump.play()
    touches = []
  }
  trex.velocityY = trex.velocityY + 0.5;
  spawnclouds();
  spawnobs();

  if(trex.isTouching(obsgroup)){
    die.play()
gamestate = END
  }

}else if(gamestate === END){
  ground.velocityX = 0
  obsgroup.setVelocityXEach(0)
  cloudgroup.setVelocityXEach(0)
  trex.velocityY = 0
cloudgroup.setLifetimeEach(-1)
obsgroup.setLifetimeEach(-1)
trex.changeAnimation("collided",trexend)
gameover.visible = true
restart.visible = true
if(mousePressedOver(restart) || touches.length>0){
  reset()
  touches = []
}
}

  //trex.velocityY = trex.velocityY + 0.5;
  trex.collide(invisground)
  
  
  drawSprites();
  fill("blue")
  text("Score: " +score, 20, 25)
}

function reset(){
  gamestate = PLAY
  gameover.visible = false
  restart.visible = false
  cloudgroup.destroyEach()
  obsgroup.destroyEach()
  score = 0
}


function spawnclouds(){
if(frameCount% 60 === 0){
  cloud=createSprite(width-1, 25, 20, 10)
  cloud.velocityX=-3
  cloud.addImage(cloudImage)
  cloud.y=Math.round(random(25,65))
  cloud.scale=0.1
  cloud.lifetime=width/3
  cloud.depth=trex.depth;
  trex.depth +=1
  cloudgroup.add(cloud)
}
}

function spawnobs(){
if(frameCount% 60 === 0){
  obs=createSprite(width-1, height-45, 10, 30)
  obs.velocityX=-3
  var a = Math.round(random(1,6)); //switch statment
  switch(a){
    case 1:obs.addImage(obs1);
    break;
    case 2:obs.addImage(obs2);
    break;
    case 3:obs.addImage(obs3);
    break;
    case 4:obs.addImage(obs4);
    break;
    case 5:obs.addImage(obs5);
    break;
    case 6:obs.addImage(obs6);
    break;
    default: break;
  }
  obs.scale=0.5
  obs.lifetime=width/3
  obsgroup.add(obs)
}
}
