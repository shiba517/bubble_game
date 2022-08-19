
// CANVAS SETUP
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const canvasInfo = {
    width: 900,
    height: 500
}
canvas.width = canvasInfo.width
canvas.height = canvasInfo.height

const gameInfo = {
    start: false,
    pause: true ,
    score: 0,
    gameFrame: 0,
    baseSpeed: 20,
    speed: 20,
}

window.addEventListener('keydown', function(e) {
    if (e.code == 'Space') {
        if (gameInfo.start == false) {
            gameInfo.start = true
        }

        if (gameInfo.pause == false) {
            gameInfo.pause = true
        }
        else {
            gameInfo.pause = false
        }
    }
})


// MOUSE INTERACTION
let canvasPosition = canvas.getBoundingClientRect()

// Create random number
function randomNumber(max_numb) {
    return (
        Math.floor((Math.random() * max_numb))
    ) 
} 

const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown', function(e) {
    mouse.click = true
    mouse.x = e.x - canvasPosition.left
    mouse.y = e.y - canvasPosition.top
})

canvas.addEventListener('mouseup', function(e) {
    mouse.click = false
})

const player1Left = new Image()
player1Left.src = 'images/player/AttackL (10).png'  // Forward slash; not back slash!!
const player1Right = new Image()
player1Right.src = 'images/player/Attack (10).png'


// PLAYER CREATION
class createBall {
    constructor() {
        this.name = 'hero'
        this.x = canvas.width/2
        this.y = canvas.height/2
        this.radius = 50 
    }

    update() {
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y

        if (mouse.x < this.x) {
            this.x -= dx / gameInfo.speed
        }
        if (mouse.x > this.x) {
            this.x -= dx / gameInfo.speed
        }
        if (mouse.y < this.y) {
            this.y -= dy / gameInfo.speed
        }
        if (mouse.y > this.y) {
            this.y -= dy / gameInfo.speed
        }

        console.log(this.x + ' ' + this.y)
    }

    draw() {       
        ctx.lineWidth = 0.1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'transparent'
        ctx.fill()
        ctx.stroke()  
        
        if (this.x > mouse.x) {
            ctx.drawImage(player1Left, this.x - 80, this.y - 80, this.radius * 3, this.radius * 3)
        }
        else {
            ctx.drawImage(player1Right, this.x - 80, this.y - 80, this.radius * 3, this.radius * 3)
        }
        
    }    
}

const player1 = new createBall()

// BUBBLE CREATION
const bubblesArray = []

const bubblesTypeArray = {
    goodBubble: {
        name: 'bad',
        frequency: 100,
        radius: 30,
        speed: 1.5,
        colour: 'blue',
        collided: false,
        points: 20,
        image: {
            src: 'images/enemies/good.png',
            imgs: 14,
            adjustX: 50,
            adjustY: 65,
            blowup: 3
        }
    },
    badBubble: {
        name: 'good',
        frequency: 200,
        radius: 30,
        speed: 1,
        colour: 'orange',
        collided: false,
        points: -10,
        image: {
            src: 'images/enemies/bad.png',
            imgs: 8,
            adjustX: 45,
            adjustY: 45,
            blowup: 2.5
        }
    },
    steelBubble: {
        name: 'steel',
        frequency: 250,
        radius: 40,
        speed: 2,
        colour: 'grey',
        collided: false,
        points: -5,
        image: {
            src: 'images/enemies/steel.png',
            imgs: 11,
            adjustX: 70,
            adjustY: 50,
            blowup: 2.5
        },
        bounceDistance: 200,
    },
    slimeBubble: {
        name: 'slime',
        frequency: 400,
        radius: 40,
        speed: 0.5,
        colour: 'green',
        collided: false,
        points: -0.5,
        image: {
            src: 'images/enemies/slime.png',
            imgs: 10,
            adjustX: 55,
            adjustY: 45,
            blowup: 2.5
        },
        challengeSpeed: 100
    },
    deathBubble: {
        name: 'death',
        frequency: 600,
        radius: 50,
        speed: 0.75,
        colour: 'red',
        collided: false,
        points: -50,
        image: {
            src: 'images/enemies/death.png',
            imgs: 10,
            adjustX: 85,
            adjustY: 65,
            blowup: 4
        }
    }
}

class createBubble {
    constructor(bubbleType) {
        this.name = bubbleType.name
        this.radius = bubbleType.radius
        this.speed = bubbleType.speed
        this.x = randomNumber(canvas.width)
        this.y = canvas.height + (this.radius)
        this.cDistance
        this.colour = bubbleType.colour
        this.points = bubbleType.points
        this.image = bubbleType.image
    }

    update() {
        this.y -= this.speed
        let dx = this.x - player1.x
        let dy = this.y - player1.y
        this.cDistance = Math.sqrt((dx * dx) + (dy * dy))
    }

    draw() {       
        ctx.lineWidth = 0.2
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fillStyle = this.colour
        ctx.fill()
        ctx.stroke()   
        
        const bubimg = new Image()
        bubimg.src = this.image.src
        // bub.src = 'enemies/good.png'
        
        ctx.drawImage(bubimg, 
            0, 0, 
            bubimg.width / this.image.imgs, bubimg.height, 
            this.x - this.image.adjustX, this.y - this.image.adjustY, 
            (bubimg.width / this.image.imgs) * this.image.blowup, bubimg.height * this.image.blowup)       
    }
}

class createSteelBubble extends createBubble {
    constructor(bubbleType) {
        super(bubbleType)
        this.bounceDistance = bubbleType.bounceDistance
    }
}

class createSlimeBubble extends createBubble {
    constructor(bubbleType) {
        super(bubbleType)
        this.challengeSpeed = bubbleType.challengeSpeed
    }
}

function controlBubbles() {
    // Release bubbles
    if (gameInfo.gameFrame % bubblesTypeArray.badBubble.frequency == 0) {
        bubblesArray.push(new createBubble(bubblesTypeArray.badBubble))
    }
    if (gameInfo.gameFrame % bubblesTypeArray.goodBubble.frequency == 0) {
        bubblesArray.push(new createBubble(bubblesTypeArray.goodBubble))
    }
    if (gameInfo.gameFrame % bubblesTypeArray.steelBubble.frequency == 0) {       
        bubblesArray.push(new createSteelBubble(bubblesTypeArray.steelBubble))
    }
    if (gameInfo.gameFrame % bubblesTypeArray.slimeBubble.frequency == 0) {
        bubblesArray.push(new createSlimeBubble(bubblesTypeArray.slimeBubble))
    }
    if (gameInfo.gameFrame % bubblesTypeArray.deathBubble.frequency == 0) {
        bubblesArray.push(new createBubble(bubblesTypeArray.deathBubble))
    }
    

    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update()
        bubblesArray[i].draw()
    }
    // Below forloop partenered with above code and is created to eliminate flashing of bubbles when spliced()
    for (let i = 0; i < bubblesArray.length; i++) {
        // bubbles dissapear once off canvas
        if (bubblesArray[i].y + (bubblesArray[i].radius) < 0) {
            bubblesArray.splice(i, 1)
        }
        // collision detection
        if (bubblesArray[i].cDistance < (bubblesArray[i].radius + player1.radius)) {
            bubblesArray[i].collided = true
            if (bubblesArray[i].collided == true) {
                gameInfo.score += bubblesArray[i].points
                // Specefic behaviour for steel bubbles
                if (bubblesArray[i].name == 'steel') {
                    if (bubblesArray[i].x < player1.x) {
                        mouse.x += bubblesArray[i].bounceDistance
                    }
                    if (bubblesArray[i].y < player1.y) {
                        mouse.y += bubblesArray[i].bounceDistance
                    }
                    if (bubblesArray[i].x > player1.x) {
                        mouse.x -= bubblesArray[i].bounceDistance
                    }
                    if (bubblesArray[i].y > player1.y) {
                        mouse.y -= bubblesArray[i].bounceDistance
                    }
                }
                if (bubblesArray[i].name != 'slime') {
                    bubblesArray.splice(i, 1)
                }              
            }            
        }
    }
}



function animate() {
    if (gameInfo.pause == false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        player1.update()
        player1.draw()
        
        gameInfo.gameFrame += 1

        controlBubbles()

        // Score sheet
        ctx.font = '30px Noto Sans'
        ctx.fillStyle = 'yellow'
        ctx.textAlign = 'left'
        ctx.fillText(gameInfo.score, 20, 50)
    }
    else {
        ctx.rect(0, 0, canvas.width, canvas.height )
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fill()

        if (gameInfo.start == false) {
            ctx.font = '30px Noto Sans'
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.fillText('Press spacebar to enter', canvas.width / 2, canvas.height / 2)
        }
        else if (gameInfo.start == true && gameInfo.pause == true) {
            ctx.font = '30px Noto Sans'
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.fillText('Paused', canvas.width / 2, canvas.height / 2)
        }      
    }

    requestAnimationFrame(animate)
}
animate()