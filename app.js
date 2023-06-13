var colors = ["green","red","yellow","blue"];
function wait_for_key(){
  return new Promise(function(resolve) {
    function listener() {
      $(document).off("keydown", listener);
      resolve();
    }
    $(document).on("keydown", listener);
  })
}
function wait_for_click(clr){
  return new Promise(function(resolve){
    function handleClick(e){
      $(".btn").off("click",handleClick);
      $("#"+e.target.id).addClass("pressed");
      makeSound(e.target.id);
      setTimeout(function(){
        $("#"+e.target.id).removeClass("pressed");
      },300)
      if(clr==e.target.id){
        resolve(true);
      }else{
        resolve(false);
      }
    }
    $(".btn").on("click",handleClick);
  })
}
function makeSound(clr){
  var audio = new Audio("./sounds/"+clr+".mp3");
  audio.play();
}
function wait_for_color(memory){
  return new Promise(function(resolve){
    setTimeout(function(){
      var n = Math.floor(Math.random()*4);
      memory.push(colors[n]);
      $("#"+colors[n]).addClass("pressed");
      makeSound(colors[n]);
      setTimeout(function(){
        $("#"+colors[n]).removeClass("pressed");
      },300)
      resolve();
    },1000);
  })
}
var counter = 1;
var memory = [];
var flag = true;
async function simonGame(){
  while(1){
    flag = true;
    var heading = $("#level-title").text();
    if(heading=="Press A Key to Start"){
      await wait_for_key();
      $("#level-title").text("Level "+counter);
    }else if(heading=="Game over, Press Any Key to Restart"){
      await wait_for_key();
      $("#level-title").text("Press A Key to Start");
    }
    else{   
      await wait_for_color(memory);   
      var i=0;     
      while(i<memory.length){
        flag = await wait_for_click(memory[i]);
        if(!flag){
          counter = 1;
          memory = [];
          $("body").addClass("game-over");
          makeSound("wrong");
          $("#level-title").text("Game over, Press Any Key to Restart");

          setTimeout(function(){
            $("body").removeClass("game-over");
          },200)
          break;
        }
        i++;
      }
      if(flag){
        counter++;
        $("#level-title").text("Level "+counter);
      }
    }
  }
}
simonGame();

