class Enemy {
    constructor () {
        this.velocity = (Math.random() * 280) + 120;
        this.velocityMultiplier = 1;
        this.x = -120;
        this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
        this.sprite = 'images/enemy-bug.png';
    }

    distanceFromPlayer() {
        return Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
    }

    update(dt) {
        this.x += this.velocity * dt;
        if (this.x > 720) {
            this.x = -60;
            this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
            this.velocity = (Math.random() * 240 * enemy.velocityMultiplier) + 120 ;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
class Player {
    constructor () {
        this.moves = 0;
        this.x = 200;
        this.y = 400;
        this.sprite = 'images/char-boy.png';
        this.wins = 0;
        this.lives = 3;
    }

    resetPosition() {
        this.x = 200;
        this.y = 400;
    }

    update() {
        if (this.y < 56) {
            player.resetPosition();
            this.wins++;
            enemy.velocityMultiplier++;
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
            this.lives--;
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

class Gem {
    constructor(name) {
        this.x = gemPositions.x[Math.floor((Math.random() * 5))];
        this.y = gemPositions.y[Math.floor((Math.random() * 3))];
        this.sprite = `images/${name}.png`;
    }

    distanceFromPlayer() {
        return Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
    }

        render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// This class requires an update(), render() and
// a handleInput() method.

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var hasCollided = false;
var gemCollected = false;
const allEnemies = [];
const enemyInitialPosition = [56, 142, 228]
const allGems = [];
const gemNames = ['gem-blue', 'gem-orange', 'gem-green'];
const gemPositions = { 
    x: [-2, 99, 200, 301, 402],
    y: [56, 142, 228]
    };

for (let i = 0; i < 8; i++) {
    let enemy = new Enemy();
    enemy.name = i;
    allEnemies.push(enemy);
}

/*
for (name of gemNames) {
    let gem = new Gem(name);
    allGems.push(gem);
}
*/
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
