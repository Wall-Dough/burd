var bird1;
var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_space = false;
var wings_down = false;
var destroy_wings = false;
var wings_interval = null;
var max_yv = 1600;
var min_yv = -1600;
var framerate = 60;
var spriteImgs = [];
var sprites = [];

function changeBrightness(percent) {
    for (var i = 0; i < 3; i++) {
        var d = sprites[i].data;
        for (var j = 0; j < d.length; j += 4) {
            d[i] = d[i] * percent / 100;
            d[i + 1] = d[i + 1] * percent / 100;
            d[i + 2] = d[i + 2] * percent / 100;
        }
    }
}

function resetSprites() {
    spriteImgs[0] = document.getElementById("burd-sprite-1");
    spriteImgs[1] = document.getElementById("burd-sprite-2");
    spriteImgs[2] = document.getElementById("burd-sprite-3");
    for (var i = 0; i < 3; i++) {
        var memCanvas = document.createElement("canvas");
        memCanvas.width = spriteImgs[i].width;
        memCanvas.height = spriteImgs[i].height;
        var memCtx = memCanvas.getContext("2d");
        memCtx.drawImage(spriteImgs[i], 0, 0);
        sprites[i] = memCtx.getImageData(0, 0, memCanvas.width, memCanvas.height);
    }
}

function changeColor(brightness) {
    if ((brightness > 100) || (brightness < 0)) {
        return;
    }
    changeBrightness(brightness);
}

function draw_bird(bird) {
	var burd_sprite;
	if (key_space) {
		burd_sprite = 1;
	} else if (wings_down) {
		burd_sprite = 2;
	} else {
		burd_sprite = 0;
	}
	var c = document.getElementById("canvas");
	if (bird.x > c.width) {
		bird.x -= c.width;
	}
	else if (bird.x < 0) {
		bird.x += c_width;
	}
	if (bird.y > c.height) {
		bird.y -= c.height;
	}
	else if (bird.y < 0) {
		bird.y += c.height;
	}
	var angle;
	if (bird.xv == 0) {
		angle = Math.PI / 2;
		if (bird.yv < 0) {
			angle = -angle;
		}
	}
	else {
		angle = Math.atan(bird.yv / bird.xv);
	}
	var ctx = c.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.save();
	ctx.translate(bird.x, bird.y);
	ctx.rotate(angle);
	ctx.translate(-bird.x, -bird.y);
	ctx.putImageData(sprites[burd_sprite], bird.x - spriteImgs[burd_sprite].width, bird.y - spriteImgs[burd_sprite].height);
	ctx.restore();
}

function update_bird(bird) {
	if (bird1.yv < min_yv) {
		bird1.yv = min_yv;
	}
	if (bird1.yv > max_yv) {
		bird1.yv = max_yv;
	}
	bird.y += bird.yv / framerate;
	bird.x += bird.xv / framerate;
	draw_bird(bird);
	if (key_up) {
		if (!key_left) {
			bird.yv += bird.g / 5 / framerate;
		}
	} else {
		bird.yv += bird.g / framerate;
	}
}


function start_game() {
    resetSprites();
    changeColor(50);
	bird1 = new Object();
	bird1.x = 10;
	bird1.y = 30;
	bird1.xv = 300;
	bird1.yv = 0;
	bird1.g = 600;
	setInterval(function(){update_bird(bird1);}, 1000 / framerate);
	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key == 38) {
			key_up = true;
		} else if (key == 40) {
			key_down = true;
		} else if (key == 37) {
			key_left = true;
		} else if (key == 39) {
			key_right = true;
		} else if (key == 32) {
			key_space = true;
		}
	}
	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key == 38) {
			key_up = false;
		} else if (key == 40) {
			key_down = false;
		} else if (key == 37) {
			key_left = false;
		} else if (key == 39) {
			key_right = false;
		} else if (key == 32) {
			key_space = false;
			wings_down = true;
			if (wings_interval != null) {
				clearInterval(wings_interval);
			}
			wings_interval = setInterval(flight, 125);
			if (key_up) {
				bird1.yv -= 125;
			} else {
				bird1.yv -= 150;
			}
			if (key_left) {
				bird1.xv += 2;
			} else if (key_right) {
				bird1.xv -= 2;
			}
		}
	}
}

function flight() {
	wings_down = true;
	if (destroy_wings == false) {
		destroy_wings = true;
	} else {
		wings_down = false;
		destroy_wings = false;
		clearInterval(wings_interval);
		wings_interval = null;
	}
}

window.onload = function () {
    start_game();
}
