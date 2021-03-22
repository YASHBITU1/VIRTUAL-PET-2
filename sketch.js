var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,600);

  addFood=createButton("Add Food");
     addFood.position(600,95);
    addFood.mousePressed(addFoods);

  foodObj = new Food();

  foodStock=database.ref('Food');
    foodStock.on("value",readStock);
  
  dog=createSprite(500,300,150,150);
    dog.addImage(sadDog);
  dog.scale=0.5;
  
  feed=createButton("Feed the dog");
    feed.position(500,95);
  feed.mousePressed(feedDog);

  
}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 150 ,30);
   }else if(lastFed==0){ 
     text("Last Feed : 12 AM", 150, 30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 150 ,30);
   }
 
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}