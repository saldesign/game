/*To Do

Fish/Shark Hit alert
Low air alert
add more lvls

Flying Fish

Intro Details: Fish Points, Air, Shark
Spearable intro fish
Unlt range during intro

*/

//Elements
var diver = $('#diver'),
	stage = $('#gameStage'),
	sharkFreq = 15000,
	sharkSpeed = 5000,
	targetFreq = 4000,
	targetSpeed = 700,
	air = 15,
	range = 435, //distance spear travels
	availability = true, //tells us if spear is available to shoot
	airTimer;

var dir = {
	up: false,
	down: false,
	left: false,
	right: false
},
	speed = 2;
	score = 0;
	lives = 4;

$('.start').click(startGame);

function startGame(){
	gameRunning = true;
	$('.intro').hide();
	$('#lifeBar').show();
	$('#airBar').show();
	$('#score').show();
	$('#gunLvl').show();
	diver.sprite({fps:7, no_of_frames:4});
	stage.pan({fps:30, speed:6, direction:'left'});
	createTargetInt = setInterval(createTarget,targetFreq),
	createSharkInt = setInterval(createShark,sharkFreq);
	updateLifebar();
	airTimer = setInterval(airSupply,1000);
	//like setTimeout this runs only once
	theLoop = window.requestAnimationFrame(gameLoop);
}//End startGame()

$(document).keydown( function(e){
	if(e.which == 13){
		//enter
		$('.button').trigger('click');
	}
});//End enter button.keydown

$(document).keydown( function(e){
//arrow keys: up:38 down:40 left:37 right:39
//aswd keys: up(w):87 down(s):83 left(a):65 right(d):68
//console.log(e.which); //lets us check which key 
	if(e.which == 38 || e.which == 87){
	//up
	dir.up = true;
	}
	if(e.which == 40 || e.which == 83){
	//down
	dir.down = true;
	}
	if(e.which == 37 || e.which == 65){
	//left
	dir.left = true;
	}
	if(e.which == 39 || e.which == 68){
	//right
	dir.right = true;
	}
	//make diver move faster when shift key is down
	if(e.which == 16){
		speed = 10;
		diver.fps(14);
	}
	//spacebar
	if(e.which == 32){
		if(availability){
		shootSpear();
	}
	}
})//End document.keydown

$(document).keyup( function(e){
//arrow keys - up:38 down:40 left:37 right:39
//aswd keys - up(w):87 down(s):83 left(a):65 right(d):68
	// console.log(e.which);
	if(e.which == 38 || e.which == 87){
		dir.up = false;
	}
	if(e.which == 40 || e.which == 83){
		dir.down = false;
	}
	if(e.which == 37 || e.which == 65){
		dir.left = false;
	}
	if(e.which == 39 || e.which == 68){
		dir.right = false;
	}
	//diver speed reset
	if(e.which == 16){
		speed=2;
		diver.fps(7);
	}
})//end document.keyup()

function recthit(rectone, recttwo){
    console.log('recthit called');
    var r1 = $(rectone);
    var r2 = $(recttwo);
    
    var r1x = r1.offset().left;
    var r1w = r1.width();
    var r1y = r1.offset().top;
    var r1h = r1.height();
    
    var r2x = r2.offset().left;
    var r2w = r2.width();
    var r2y = r2.offset().top;
    var r2h = r2.height();
    
    if( r1y+r1h < r2y ||
        r1y > r2y+r2h ||
        r1x > r2x+r2w ||
        r1x+r1w < r2x ){
        console.log('recthit-false')
        return false;
    }else{
      console.log('recthit-true')
        return true;   
    }
}//end recthit

function createTarget(){
	var target = $('<div>').addClass('target');
	var randNum = Math.random();
	if(randNum > 0.9){
		target.addClass('t3');
	}else if(randNum>0.6){
		target.addClass('t2');
	}else{
		target.addClass('t1');
	}
	//starting location
	var eLeft = stage.width() + 170;//width of element
	var eTop = (Math.random()* (stage.height() - 176))+100;//height of fish

	//applies location to target before appended to stage
	target.css({top: eTop, left: eLeft});

	stage.append(target);
	animateTarget(target);
	//append to stage
	// stage.append(target);
	// target.animate({left:-170}, 6000, function(){
	// 	$(this).remove();//removes itself after animation complete
	// })
}//End createTarget

function createShark(){
	var shark = $('<div>').addClass('shark enemy');
	
	//starting location
	var eLeft = stage.width() + 100;
	var eTop = (Math.random()* (stage.height() - 176))+100;//-174 is height of shark

	//applies location to shark before appended to stage
	shark.css({top: eTop, left: eLeft});


	//append to stage
	stage.append(shark);
	shark.animate({left:-500}, sharkSpeed, function(){
		$(this).remove();//removes itself after animation complete
	})
}//End createShark

function animateTarget(target){
	var randTime = (Math.random()*targetSpeed)+300;	//time from 300ms to 1000ms
	// console.log('targets:', $('.target').length)
	randDir = Math.round(Math.random()); //should return random 1 or 0;

//console.log(randDir)
	 if (randDir) {
	 	eTop = '-=30';
	 	swim = '13deg';
    } else {
		eTop = '+=30';
		swim = '-13deg';
    }

	// console.log(eTop);
	target.transition({left: '-=100', top:eTop, perspective:'100px', rotateY:swim},	 randTime, function(){

	 	if($(this).position().left < -200){
	 		// console.log('target removed');
	 		$(this).remove(); //removes itself after animation is complete
	  	}else{
			if($('.target').length > 0){
	 		animateTarget($(this));
	 		}
	 	}
	});//End randTime()
}//End animateTarget()

function killTarget(target){
	//grab target and change its background image to ghost version
	target.stop().transition({left:'+=50', top:'-=75', opacity: '0'},'cubic-bezier(0,1.07,1,.99)', function(){
		$(this).remove();
	});
}//End killTarget()

function shootSpear(){
	availability = false;
	var spear = $('<div>').addClass('spear');
	var diverTop = diver.position().top;
	var diverLeft = diver.position().left;
	diverTop+=28;
	diverLeft+=350;
	spear.css({top:diverTop,left:diverLeft});
	stage.append(spear);
	spear.animate({left:'+='+range}, 500, function(){
		$(this).remove();
		availability = true;
	})
}//End shootSpear

function gunRange(){
	var gunLvl = $('#gunLvl');
	if(score >= 4){
		range=900;
		gunLvl.text('Gun Lvl: 3');
		sharkFreq = 4000;
		targetFreq = 2000;
		sharkSpeed = 3000,
		targetSpeed = 400,
		clearInterval(createSharkInt);
		clearInterval(createTargetInt);
		createSharkInt = setInterval(createShark,sharkFreq);
		createTargetInt = setInterval(createTarget,targetFreq);

	}else if(score >= 1){
		range=600;
		gunLvl.text('Gun Lvl: 2');
		sharkFreq = 7000;
		targetFreq = 3000;
		sharkSpeed = 4000,
		targetSpeed = 600,
		clearInterval(createSharkInt);
		clearInterval(createTargetInt);
		createSharkInt = setInterval(createShark,sharkFreq);
		createTargetInt = setInterval(createTarget,targetFreq);
	}
}//End gunRange()

function airSupply(){
	air--;
	var airBar = $('.airBar');
	var percent = air/15;
	percent = percent*100;
	airBar.html(air+'&nbsp;Seconds')
	// airBar.animate({
	// 	width:percent+'%'
	// }, 400);
	if(air<=5){
		$('.airBar').transition({'background-color':'#FF3F3F',width:percent+'%'}, 600).transition({'background-color':'white'}, 400);
	}else{
		$('.airBar').transition({'background-color':'cadetblue',width:percent+'%'});
	}
	if(air<=0){
		gameOver();
	}
}//End airSupply


	// spear.animate({left:'+='+range}, 500, function(){
	// 	$(this).remove();
	// 	availability = true;
	// })

function updateLifebar(){
	var percent = lives/4;
	percent = percent*100;
	var lifeBar = $('.lifeBar');
	lifeBar.html(lives+'&nbsp;Health')
	lifeBar.animate({
		width:percent+'%'
	}, 400);
	if(lives<=0){
		gameOver();
	}
}//End updateLifebar()

function gameLoop(){
	var newTop = 0;
	var newLeft = 0;

	if(dir.up){  
		newTop -= speed;
	}
	if(dir.down){
		newTop += speed;
	}
	if(dir.left){
		newLeft -= speed;
		diver.spState(2);//changes row of animation
		diverState = 2;//tracks row change
		// stage.spChangeDir('left');//change pan direction
	}
	if(dir.right){
		newLeft += speed;
		diver.spState(1);//changes row of animation
		diverState = 1;//tracks row change
		// stage.spChangeDir('right');//change pan direction
	}

	//values for positions of things
	var dTop = diver.position().top,
			dLeft = diver.position().left,
			dHeight = diver.outerHeight(),
			//box model height full. if (true) will include margin
			dWidth = diver.outerWidth(),
			sHeight = stage.height(),
			sWidth = stage.width();

	//conditions for boundries
	//dTop + newTop is where diver is going to go when new position is applied in the CSS function below
	//check direction and position to determine if we want to apply new position to the diver

	//top wall
	if(dTop + newTop < 45){
		newTop = 0;
	}
	//bottom wall
	if(dTop + newTop + dHeight > sHeight){
		newTop = 0;
		newTop+=(sHeight-dTop-dHeight);
		//aligns bottom of diver to bottom boundry of stage
	}
	//left wall
	if(dLeft+newLeft<0){
		newLeft = 0;
		newLeft -= dLeft;
	}
	//right wall
	if(dLeft+newLeft+dWidth > sWidth){
		newLeft = 0;
		newLeft =+ (sWidth-dWidth-dLeft);
	}
	if(dTop < 71){
		air = 16;
	}
	//diver positioning
	diver.css({
		top:'+='+newTop,
		left:'+='+newLeft,
	})

	$('.spear').each( function(){
		var projectile = $(this);
		$('.target').each( function(){
			if(recthit(projectile, $(this))){
				if($(this).hasClass('t3')){
					points=10;
				}else if($(this).hasClass('t2')){
					points=5;
				}else{
					points=1;
				}
				score+=points;
				gunRange();
				$('#score').html('| Points: '+score);
				projectile.remove();
				// $(this).stop();
				killTarget($(this));
			}
		})//End enemy.each()
	})//End spear.each()

	$('.enemy').each( function(){
		if(recthit(diver, $(this))){
			//remove enemy
			$(this).removeClass('enemy');
			//remove a life
			lives--;
			updateLifebar();
			killTarget($(this));
		}
	})//end lives function

	$('.shark').each( function(){
		var shark = $(this);
		$('.target').each( function(){
			if(recthit(shark, $(this))){
				killTarget($(this));
			}
		})
	})//end shark eat target function

	//must be at end to request next frame consistantly
	window.requestAnimationFrame(gameLoop);

}//end gameLoop()

function gameOver(){
	clearInterval(createTargetInt);
	clearInterval(createSharkInt);
	$('.target').remove();
	$('.shark').remove();
	diver.destroy();
	diver.remove();
	stage.destroy();
	gameRunning = false;
	theLoop = null;
	$(document).unbind();
	stage.html('<h1>Game Over</h1><div class="button again">Play Again</div>');
	$('.again').click(function(){
		location.reload();
	})
	$(document).keydown( function(e){
		if(e.which == 13){
			$('.again').trigger('click');
		}
	})
}//End gameOver()