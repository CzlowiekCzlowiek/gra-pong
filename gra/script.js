const canvas = document.querySelector('canvas')

const scale = 1.4;
canvas.width = 800 * scale
canvas.height = 400 * scale

const ctx = canvas.getContext("2d");

const paddleHeight = 83 * scale
const paddleWidth = 15 * scale
let playerY = canvas.height/2 - paddleHeight/2;
let computerY = canvas.height/2 - paddleHeight/2;
const step = 40 * scale
const fontSize = 35 * scale;

const minSpeed = 6.8 * scale;

let ballX = canvas.width/2
let ballY = canvas.height/2;
let moveX;
let moveY;
let ballRadius = 10 * scale;

let score = 0;

let gameLoop;
let gameRunning = false;

let muzyka = new Audio()



ctx.fillstyle = 'white'
ctx.font = `${fontSize*8/7}px Helvetica`;
ctx.fillText("Press space to start", canvas.width*0.27, canvas.height*0.53)



document.addEventListener('keydown',handleInput);
function handleInput(e) {
    switch (e.code) {
        case 'Space':
            if (!gameRunning) startGame();
            break;
        case 'Escape':
            if (gameRunning) endGame();
            break;
        case 'ArrowUp':
            if (playerY > 0) playerY -= step;
            break;
        case 'ArrowDown':
            if (playerY < canvas.height - paddleHeight) playerY += step;
            break;
    }
}


function losowa(a, b) {
    let liczba = Math.floor(Math.random() * (b-a+1))
    liczba += a;
    return liczba;
}
function resetVariables() {
    playerY = canvas.height/2 - paddleHeight/2;
    computerY = canvas.height/2 - paddleHeight/2;
    ballX = canvas.width/2
    ballY = canvas.height/2;
    moveX = -6.7 * scale;
    moveY = 0 * scale;
    score = 0;
}
function startGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    resetVariables();
    gameRunning = true;
    gameLoop = setInterval(loop, 15)
    nowaMuzyka();
}
function nowaMuzyka() {
    liczba = Math.floor(Math.random()*7) + 1; // [1,7];
    let path = "muzyka/"+"mozart"+liczba+".mp3"
    muzyka = new Audio(path)
    muzyka.play();
}
function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    muzyka.pause();

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillstyle = 'white'
    ctx.font = `${fontSize}px Helvetica`;
    ctx.fillText("Game Ended", canvas.width*0.35, canvas.height*0.45)
    ctx.fillText(`Your score: ${score}`, canvas.width*0.35, canvas.height*0.58);
}
function drawBall(x, y) {
    ctx.beginPath(); // zresetuj sciezke rysowania
    ctx.fillStyle = 'white'
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI)
    ctx.fill()
}
function drawPlayerPaddle() {
    ctx.fillStyle = 'blue'
    ctx.fillRect(0,playerY,paddleWidth,paddleHeight)
}
function drawComputerPaddle() {
    ctx.fillStyle = 'black'
    ctx.fillRect(canvas.width - paddleWidth ,computerY,paddleWidth,paddleHeight)    
}
function drawScore() {
    ctx.font = `${fontSize*5/7}px Helvetica`
    ctx.fillText(`score: ${score}`, canvas.width*0.44, canvas.height*0.13)
}
function collide() {
    // kolizja z gory lub z dolu
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        moveY = -moveY;
    }
    // kolizja z graczem
    if (ballX <= paddleWidth+ballRadius && Math.abs((playerY+paddleHeight/2)-ballY)-ballRadius <= paddleHeight/2) {
        moveX = -moveX + randomBounce()*2*scale;
        keepSpeedLimit();
        moveY += randomBounce()*1.15*scale;
        score++;
        if (score % 10 === 0) minSpeed += 0.2;
        ballX = paddleWidth + ballRadius + 0.01;
        let uderzenie = new Audio(`pingpong${losowa(1,2)}.mp3`);
        uderzenie.volume = 0.44
        uderzenie.play();
    }
    // kolizja z komputerem
    if (ballX >= canvas.width-paddleWidth-ballRadius && Math.abs((computerY+paddleHeight/2)-ballY)-ballRadius <= paddleHeight/2) {
        moveX = -moveX + randomBounce()*2.3*scale;
        keepSpeedLimit();
        moveY += randomBounce()*1.25*scale;
        ballX = canvas.width - paddleWidth - ballRadius - 0.01;
        let uderzenie = new Audio(`kałczuk${losowa(1,4)}.mp3`);
        uderzenie.volume = 0.40
        uderzenie.play();
    }
}
function moveComputer() {
    if (computerY+paddleHeight/2 + 0.35*paddleHeight  < ballY) {
        computerY += step;
    }
    else if (computerY+paddleHeight/2 - 0.35*paddleHeight > ballY) {
        computerY -= step;
    }
}
function checkEndGame() {
    if (ballX < 0) endGame();
}
function randomBounce() {
    sign = (Math.random() < 0.75) ? '+' : '-';
    res = Number(sign + Math.random()*1);
    return res;
}
function keepSpeedLimit() {
    while (Math.abs(moveX) < minSpeed) {
        if (moveX < 0) moveX -= Math.abs(randomBounce());
        else if (moveX > 0) moveX += Math.abs(randomBounce());
    }
}


function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height); // czysci wszystko w przedziale

    drawBall(ballX, ballY)
    drawPlayerPaddle();
    drawComputerPaddle();
    drawScore();
    collide();
    checkEndGame();
    moveComputer();
    
    console.log(losowa(4,9));

    ballX += moveX;
    ballY += moveY;
}

