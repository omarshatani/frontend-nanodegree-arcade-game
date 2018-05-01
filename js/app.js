// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.velocity = (Math.random() * 280) + 120;
    this.x = -120;
    this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.velocity * dt;
    if (this.x > 720) {
        this.x = -60;
        this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
        this.velocity = (Math.random() * 240) + 120;
    }
};

Enemy.prototype.distanceFromPlayer = function() {
    return Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
class Player {
    constructor () {
        this.moves = 0;
        this.x = 200;
        this.y = 400;
        this.sprite = 'images/char-boy.png';
    }

    resetPosition() {
        this.x = 200;
        this.y = 400;
    }

    update() {
        if (this.y < 56) {
            player.resetPosition();
        }

        if (this.y > 400) {
            this.y = 400;
        }

        if (this.x < -2) 
            this.x = -2;
        if (this.x > 402) 
            this.x = 402;

        if (hasCollided) {
            player.resetPosition();
            hasCollided = false;
        }
    } 

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        switch (key) {
            case 'left': 
                this.x -= 101;
                break;
            case 'up':
                this.y -= 86;
                break;
            case 'right':
                this.x += 101;
                break;
            case 'down':
                this.y += 86;
        }
    }
}

class Star () {
    constructor() {
        this.x: 0;
        this.y: 0;
        this.sprite = `images/${allStars[0]}.png`;
    }
}

// This class requires an update(), render() and
// a handleInput() method.

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var hasCollided = false;
let allEnemies = [];
let enemyInitialPosition = [56, 142, 228]
for (let i = 0; i < 5; i++) {
    let enemy = new Enemy();
    enemy.name = i;
    allEnemies.push(enemy);
}

let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
