/* TODO 
 * View the hearts on the screen 4
 * Add lives logic 2 (Completed)
 * Add character selection 7
 * Finish game logic by adding difficulties 6
 * Add finish game result, with points 5
 * Add gem logic 1 (Completed)
 * Add Game class 4
 */

class Game {
    constructor () {
        this.hearts = 3;
        this.level = 1;
        this.wins = 0;
        this.points = 0;
        this.gemCollected = 0;
        this.difficulty = 1;
    }
}

class Enemy {
    constructor () {
        this.velocity = (Math.random() * 280) + 120;
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
            this.velocity = (Math.random() * 240 * game.difficulty) + 120 ;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

// Now write your own player class
class Player {
    constructor () {
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
            game.wins++;
            game.difficulty++;
            game.level++;
            gem.stopRendering = false;
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
            game.hearts--;
            if (game.hearts === 0) {
                console.log("YOU LOSE"); // TODO: change this thing with a proper result screen
            }
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
var stopRendering = false;
const allEnemies = [];
const enemyInitialPosition = [56, 142, 228]
const allGems = [];
const gemNames = ['gem-blue', 'gem-orange', 'gem-green'];
const gemPositions = { 
    x: [-2, 101, 202, 303, 404],
    y: [56, 142, 228]
    };


let game = new Game ();
let gem = new Gem(gemNames[Math.floor((Math.random() * 3))]);
let player = new Player();
for (let i = 0; i < 5; i++) {
    let enemy = new Enemy();
    enemy.name = i;
    allEnemies.push(enemy);
}


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
