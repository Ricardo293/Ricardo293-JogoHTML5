function start() {
	
	$("#start").hide();

	$("#gameBackground").append("<div id='player' class='anima1'></div>");
	$("#gameBackground").append("<div id='enemy1' class='anima2'></div>");
	$("#gameBackground").append("<div id='enemy2' ></div>");
	$("#gameBackground").append("<div id='friend' class='anima3'></div>");
	$("#gameBackground").append("<div id='score'></div>");
	$("#gameBackground").append("<div id='energy'></div>");

	var game = {};
	var speed = 5;
	var positionY = parseInt(Math.random() * 334);
	var KEY = {W: 87, S: 83, D: 68};
	var canShoot = true;
	var gameOver = false;
	var count = 0;
	var saved = 0;
	var lost = 0;
	var currentEnergy = 3;

	game.timer = setInterval(loop, 30);

	game.pressed = [];

	var shotSound = document.getElementById("shotSound");
	var explosionSound = document.getElementById("explosionSound");
	var music = document.getElementById("music");
	var gameOverSound = document.getElementById("gameOverSound");
	var lostSound = document.getElementById("lostSound");
	var rescueSound = document.getElementById("rescueSound");

	music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
	music.play();

	$(document).keydown (function(e) {
		game.pressed[e.which] = true;
	});

	$(document).keyup (function(e) {
		game.pressed[e.which] = false;
	});

	function loop() {
		backgroundMove();
		playerMove();
		enemy1Move();
		enemy2Move();
		friendMove();
		collision();
		score1();
		energy();
	};

	function backgroundMove() {
		left = parseInt($('#gameBackground').css('background-position'));
		$('#gameBackground').css('background-position', left -1);
	};

	function playerMove() {
		if(game.pressed[KEY.W]) {
			var top = parseInt($('#player').css('top'));
			$('#player').css('top', top -10);

			if(top <= 0) {
				$('#player').css('top', top +10);
			};

		};
		if(game.pressed[KEY.S]) {
			var top = parseInt($('#player').css('top'));
			$('#player').css('top', top +10);
			
			if(top >= 434) {
				$('#player').css('top', top -10);
			};

		};
		if(game.pressed[KEY.D]) {
			shoot();
		};
	};

	function enemy1Move() {
		positionX = parseInt($('#enemy1').css('left'));
		$('#enemy1').css('left', positionX - speed);
		$('#enemy1').css('top', positionY);

		if(positionX <= 0) {
			positionY = parseInt(Math.random() * 334);
			$('#enemy1').css('left', 694);
			$('#enemy1').css('top', positionY);
		};
	};

	function enemy2Move() {
		positionX = parseInt($('#enemy2').css('left'));
		$('#enemy2').css('left', positionX - 3);

		if(positionX <= 0) {
			$('#enemy2').css('left', 775);
		};
	};

	function friendMove() {
		positionX = parseInt($('#friend').css('left'));
		$('#friend').css('left', positionX + 1);

		if(positionX > 906) {
			$('#friend').css('left', 0);
		};
	};

	function shoot() {
	
		shotSound.play();
		if(canShoot == true) {
			canShoot = false;
		
			top1 = parseInt($("#player").css("top"))
			positionX= parseInt($("#player").css("left"))
			shotX = positionX + 190;
			topShot= top1 + 37;
			$("#gameBackground").append("<div id='shot'></div");
			$("#shot").css("top",topShot);
			$("#shot").css("left", shotX);
		
		var shotTime = window.setInterval(startShot, 30);
		};

		function startShot() {
			positionX = parseInt($("#shot").css("left"));
			$("#shot").css("left", positionX + 15); 
	
				if(positionX > 900) {
					window.clearInterval(shotTime);
					shotTime = null;
					$("#shot").remove();
					canShoot = true;
				};
		};
	};

	function collision() {
		var collision1 = ($("#player").collision($("#enemy1")));
		var collision2 = ($("#player").collision($("#enemy2")));
		var collision3 = ($("#shot").collision($("#enemy1")));
		var collision4 = ($("#shot").collision($("#enemy2")));
		var collision5 = ($("#player").collision($("#friend")));
		var collision6 = ($("#enemy2").collision($("#friend")));
		
		if(collision1.length > 0) {
		
			currentEnergy--;
			enemy1X = parseInt($("#enemy1").css("left"));
			enemy1Y = parseInt($("#enemy1").css("top"));
			explosion1(enemy1X, enemy1Y);
		
			positionY = parseInt(Math.random() * 334);
			$("#enemy1").css("left", 694);
			$("#enemy1").css("top", positionY);
		};

		if (collision2.length > 0) {
	
			currentEnergy--;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			explosion2(enemy2X, enemy2Y);
					
			$("#enemy2").remove();
				
			enemyReposition2();
		};	

		if (collision3.length > 0) {
			
			count = count + 100;
			speed = speed + 0.3;
			enemy1X = parseInt($("#enemy1").css("left"));
			enemy1Y = parseInt($("#enemy1").css("top"));
				
			explosion1(enemy1X, enemy1Y);
			$("#shot").css("left", 950);
				
			positionY = parseInt(Math.random() * 334);
			$("#enemy1").css("left", 694);
			$("#enemy1").css("top", positionY);
				
		};

		if (collision4.length > 0) {
		
			count = count + 50;
			speed = speed + 0.3;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			$("#enemy2").remove();
		
			explosion2(enemy2X, enemy2Y);
			$("#shot").css("left", 950);
			
			enemyReposition2();		
		};
		
		if (collision5.length > 0) {
			
			rescueSound.play();
			saved++;
			friendReposition();
			$("#friend").remove();
		};

		if (collision6.length > 0) {
	    
			lost++;
			friendX = parseInt($("#friend").css("left"));
			friendY = parseInt($("#friend").css("top"));
			explosion3(friendX, friendY);
			$("#friend").remove();
					
			friendReposition();
		};
	
	};

	function explosion1(enemy1X, enemy1Y) {
		explosionSound.play();
		$("#gameBackground").append("<div id='explosion1'></div");
		$("#explosion1").css("background-image", "url(imgs/explosion.png)");
		var div=$("#explosion1");
		div.css("top", enemy1Y);
		div.css("left", enemy1X);
		div.animate({width:200, opacity:0}, "slow");
		
		var explosionTime=window.setInterval(explosionRemove, 1000);
		
			function explosionRemove() {
				
				div.remove();
				window.clearInterval(explosionTime);
				explosionTime=null;
				
			};
			
		};
	
	function enemyReposition2() {

		var collisionTime4=window.setInterval(reposition4, 5000);
			
			function reposition4() {
			window.clearInterval(collisionTime4);
			collisionTime4=null;
				
				if (gameOver == false) {
				
				$("#gameBackground").append("<div id=enemy2></div");
				
				};
				
			};	
	};
	
	function explosion2(enemy2X, enemy2Y) {
		explosionSound.play();
		$("#gameBackground").append("<div id='explosion2'></div");
		$("#explosion2").css("background-image", "url(imgs/explosion.png)");
		var div=$("#explosion2");
		div.css("top", enemy2Y);
		div.css("left", enemy2X);
		div.animate({width:200, opacity:0}, "slow");
		
		var explosionTime2 = window.setInterval(explosionRemove2, 1000);
		
			function explosionRemove2() {
				
				div.remove();
				window.clearInterval(explosionTime2);
				explosionTime = null;
				
			};
			
	};

	function friendReposition() {
	
		var friendTime = window.setInterval(reposition6, 6000);
		
			function reposition6() {
			window.clearInterval(friendTime);
			friendTime = null;
			
			if (gameOver == false) {
			
			$("#gameBackground").append("<div id='friend' class='anima3'></div>");
			
			};
			
		};
	};

	function explosion3(friendX,friendY) {
		lostSound.play();
		$("#gameBackground").append("<div id='explosion3' class='anima4'></div");
		$("#explosion3").css("top", friendY);
		$("#explosion3").css("left", friendX);
		var explosionTime3 = window.setInterval(resetExplosion3, 1000);
		function resetExplosion3() {
		$("#explosion3").remove();
		window.clearInterval(explosionTime3);
		explosionTime3 = null;
		};
		
	};

	function score1() {
	$("#score").html("<h2> Score: " + count + " Saved: " + saved + " Lost: " + lost + "</h2>");
	};

	function energy() {
	
		if (currentEnergy == 3) {
			
			$("#energy").css("background-image", "url(imgs/energy3.png)");
		};
	
		if (currentEnergy == 2) {
			
			$("#energy").css("background-image", "url(imgs/energy2.png)");
		};
	
		if (currentEnergy == 1) {
			
			$("#energy").css("background-image", "url(imgs/energy1.png)");
		};
	
		if (currentEnergy == 0) {
			
			$("#energy").css("background-image", "url(imgs/energy0.png)");
			
			gameOver1();
		};
	
	};

	function gameOver1() {
		gameOver=true;
		music.pause();
		gameOverSound.play();
		
		window.clearInterval(game.timer);
		game.timer=null;
		
		$("#player").remove();
		$("#enemy1").remove();
		$("#enemy2").remove();
		$("#friend").remove();
		
		$("#gameBackground").append("<div id='end'></div>");
		
		$("#end").html("<h1> Game Over </h1><p>Your SCORE: " + count + "</p>" + "<div id='reboot' onClick=rebootGame()><h3>Try Again</h3></div>");
	};
};

function rebootGame() {
	gameOverSound.pause();
	$("#end").remove();
	start();
};