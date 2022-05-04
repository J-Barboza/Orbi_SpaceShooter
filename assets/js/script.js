const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['/assets/img/monster-01.png','/assets/img/monster-02.png','/assets/img/monster-03.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

// Variable
const sizeMoviment = 50;

// moviment and fire to ship
function flyShip(event) {
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    } else if (event.key === ' ') {
        event.preventDefault();
        fireLaser();
    }
}

// Up
function moveUp() {
    let topPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top')); // retorna o valor de top
    yourShip.style.top = `${topPosition - 50}px`;
    if (topPosition === 0 ){
        yourShip.style.top = `${topPosition + 50}px`;
    }
}

// Down
function moveDown() {
    let topPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top'));
    yourShip.style.top = `${topPosition + 50}px`;
    if(topPosition === 500){
        yourShip.style.top = `${topPosition - 50}px`;
    }
}

function cl(p){
    console.log(p);
}

// shot
function fireLaser() {
    let laser = createLaserImage();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserImage(){
    let xPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(getComputedStyle(yourShip).getPropertyValue('top'));

    let newLaser = document.createElement('img');
    newLaser.src = '/assets/img/shotSmall.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`
    newLaser.style.top = `${yPosition-10}px`
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');
        
        // checks if alien was hit, if yes, change the image
        aliens.forEach((alien) => {
            if (checkLaserCollision(laser, alien)){
                alien.src = '/assets/img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (xPosition === 350){
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 20);
}

// Create aleatory enemy
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random()*aliensImg.length)];

    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// 
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
       let xPosition = parseInt(getComputedStyle(alien).getPropertyValue('left'));
       if (xPosition <= 50){
           if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
           } else {
               gameOver();
           } 
       } else {
        alien.style.left = `${xPosition - 4}px`
    }
    }, 30);
}

// Collision shot x alien
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if (laserLeft != 350 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom ) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// Start Game
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

// Game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('Game over!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}