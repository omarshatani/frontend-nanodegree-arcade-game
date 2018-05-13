// This class contains the game logic, with the score and lives.
class Game {
    constructor () {
        this.hearts = 3;
        this.level = 1;
        this.wins = 0;
        this.points = 0;
        this.gemCollected = 0;
        this.difficulty = 1;
        // This property creates a random level where a new gem will spawn
        this.gemSpawnLevel = this.level + Math.floor((Math.random() * 3 + 1));
    }
    update () {
        // This if statemens spawns a new gem the player has reached the gem spawn level
        // A new gem is then pushed into an array and a new spawn level is created 
        if (this.level === this.gemSpawnLevel) {
            let gem = new Gem(gemNames[Math.floor((Math.random() * 3))]);
            gems.push(gem);
            this.gemSpawnLevel += Math.floor((Math.random() * 4 + 1));
        }
        /* If the player reaches the sea:
         * Reset his position to the initial position
         * Increase the game difficulty
         * Update the score
         * Remove the gem and let it respawn
         */
        if (player.y < 56) {
            player.resetPosition();
            this.wins++;
            this.difficulty += 0.5;
            this.level++;
            this.points += 300 + (this.gemCollected * 200);
            let score = document.querySelector('.currentScore');
            score.innerText = "";
            score.innerText += this.points;
            let currentLevel = document.querySelector('.currentLevel').innerText++;
            gems.pop();
        }
        /* If the player collided with the enemy:
         * Reset his position to the initial position
         * Decrease the player lives and update them
        */
        if (hasCollided) {
            hasCollided = false;
            player.resetPosition();
            this.hearts--;
            let heart = document.querySelector('.heart');
            heart.remove(); 
        }
        // If the player loses, all the enemies stop and the retry button will be available for click
        if (game.hearts === 0) {
            allEnemies.forEach(enemy => enemy.velocity = 0);
            let retryButton = document.querySelector('.retry');
            retryButton.removeAttribute('disabled');
            disableKeys = true;
        }
    }
}
// This class contains the enemy properties and methods
class Enemy {
    constructor () {
        // All enemies spawn with a random initial velocity between 280 and 400
        this.velocity = (Math.random() * 280) + 120; 
        this.width = 60;
        this.height = 30;
        // Initial horizontal position is off screen
        this.x = -120;
        // Initial vertical position is random and it's always between these 3 values => [56, 142, 228]
        this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
        this.sprite = 'images/enemy-bug.png';
    }

    // Returns the horizontal distance between the enemy and player in a position value
    horizontalDistance() {
        return Math.abs(this.x - player.x);
    }
    // Returns the vertical distance between the enemy and player in a position value
    verticalDistance() {
        return Math.abs(this.y - player.y);
    }

    update(dt) {
        this.x += this.velocity * dt;
        /* If the enemy has reached the end of the canvas:
        * Respawn in a new random offscreen position
        * Increase enemy velocity according to the difficulty
        */
        if (this.x > 720) {
            this.x = -60;
            this.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
            this.velocity = (Math.random() * 240 * game.difficulty) + 120;            
        }
        //Collision check
        if (this.horizontalDistance() < this.width && this.verticalDistance() === 0 || 
            this.verticalDistance() < this.height && this.horizontalDistance() === 0) {
            hasCollided = true;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}
// This class contains all of the Player properties and methods
class Player {
    constructor () {
        this.x = 200;
        this.y = 400;
        this.lives = 3;
        this.sprite = 'images/char-boy.png';
    }

    resetPosition() {
        this.x = 200;
        this.y = 400;
    }

    update() {
        // These 3 if statements prevent to go offscreen (bottom, left, right)
        if (this.y > 400)
            this.y = 400;

        if (this.x < -2) 
            this.x = -2;

        if (this.x > 402) 
            this.x = 402;
    } 

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        if (!disableKeys) {
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
}

// This class contains all of the Gem properties and methods
class Gem {
    constructor(name) {
        this.width = 100;
        this.height = 110;
        this.x = gemPositions.x[Math.floor((Math.random() * 5))];
        this.y = gemPositions.y[Math.floor((Math.random() * 3))];
        this.sprite = `images/${name}.png`;
    }

    distanceFromPlayer() {
        return Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
    }

    update() {
        // Checks if player has colleted the gem. If so, remove the gem from the gem array and wait for respawn
        if (this.distanceFromPlayer() < 40)  {
            gems.pop();
            game.gemCollected++;
        }
    }     
        render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Variables declaration
var hasCollided = false;
var gemCollected = false;
var stopRendering = false;
var reset = false;
var disableKeys = false;
// Array that contains all the enemies
const allEnemies = [];
const enemyInitialPosition = [56, 142, 228];
// Array that contains the gem
const gems = [];
// Array used to select a random color for the gem
const gemNames = ['gem-blue', 'gem-orange', 'gem-green'];
const gemPositions = { 
    x: [-2, 101, 202, 303, 404],
    y: [56, 142, 228]
    };
let game = new Game();
let player = new Player();
for (let i = 0; i < 5; i++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

// Listeners for handling the keys
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Listener used to reset the game when player clicks the RETRY button
document.addEventListener('DOMContentLoaded', function () {
    let retryButton = document.querySelector('.retry');
    retryButton.addEventListener('click', function () {
        game.level = 1;
        game.hearts = 3;
        game.wins = 0;
        game.points = 0;
        game.gemCollected = 0;
        game.difficulty = 1;

        allEnemies.forEach(enemy => {
            enemy.velocity = (Math.random() * 280) + 120;
            enemy.x = -120;
            enemy.y = enemyInitialPosition[Math.floor((Math.random() * 3))];
        });

        for (let i = 0; i < game.hearts; i++) {
            let heart = document.querySelector('.livesCounter').insertAdjacentHTML('afterend','<img src="images/Heart.png" class="heart" alt="Heart" width="50" height="85" />');
        }

        let currentLevel = document.querySelector('.currentLevel');
        currentLevel.innerText = game.level;
        let currentScore = document.querySelector('.currentScore');
        currentScore.innerText = game.points;
        retryButton.setAttribute('disabled', '""');
        disableKeys = false;
    });
});