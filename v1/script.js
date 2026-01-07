// defining constants
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 200;
const SNAKE_SIZE = 20;
const STEP_SIZE = 10;
const FRAME_DELAY = 60;
const BG_COLOR = 'pink';
const SNAKE_COLOR = 'black';
const FOOD_COLOR = 'red';
const FOOD_SIZE = 15;
// defining direction constants
const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;

// setting  up canvas
const canvas = document.getElementById("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

// global variables for snake head coordinates
let snake_x = 0;
let snake_y = 0;
let currentDirection = DIR_RIGHT;

// global variables for food coordinates
let food_x = CANVAS_WIDTH / 2;
let food_y = CANVAS_HEIGHT / 2;

function clearFrame(){
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawObject(){
    // clear the frame before each draw
    clearFrame(); 

    // draw food
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food_x, food_y, FOOD_SIZE, FOOD_SIZE);    

    // draw snake 
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fillRect(snake_x, snake_y, SNAKE_SIZE, SNAKE_SIZE);

    if(detectCollision()){
        // update food coordinates
        [food_x, food_y] = getRandomCoordinate();
    }

    switch (currentDirection) {
        case DIR_UP:
            snake_y -= STEP_SIZE;
            break;
        case DIR_DOWN:
            snake_y += STEP_SIZE;
            break;
        case DIR_LEFT:
            snake_x -= STEP_SIZE;
            break;
        case DIR_RIGHT:
            snake_x += STEP_SIZE;
            break;
    }

    snake_x = (snake_x + CANVAS_WIDTH) % CANVAS_WIDTH; // make sure snake never leaves the canvas
    snake_y = (snake_y + CANVAS_HEIGHT) % CANVAS_HEIGHT; // make sure snake never leaves the canvas
}

function changeDirection(newDirection) {
    const opposites = {
        [DIR_UP] : DIR_DOWN,
        [DIR_DOWN] : DIR_UP,
        [DIR_LEFT] : DIR_RIGHT,
        [DIR_RIGHT] : DIR_LEFT
    }

    if (opposites[currentDirection] != newDirection) {
        currentDirection = newDirection;
    }
}

function detectCollision() {    
    function overlapExists(x1, y1, x2, y2){
        return (y1 > x2) && (x1 < y2);
    }

    const snake_x_coordinate_overlap = overlapExists(snake_x, snake_x + SNAKE_SIZE, food_x, food_x + FOOD_SIZE);
    const snake_y_coordinate_overlap = overlapExists(snake_y, snake_y + SNAKE_SIZE, food_y, food_y + FOOD_SIZE);
    return snake_x_coordinate_overlap && snake_y_coordinate_overlap;
}

function getRandomCoordinate() {
    // coordinate range x,y -> 
    // [0, canvas_width - food_size), [0, canvas_height - food_size)

    const random_x = Math.random() * (CANVAS_WIDTH - FOOD_SIZE);
    const random_y = Math.random() * (CANVAS_HEIGHT - FOOD_SIZE);
    return [Math.floor(random_x), Math.floor(random_y)];
}

// make sure that there's a reasonable gap between two consecutive keystrokes being captured
document.addEventListener("keydown", (event) => {
    const keyToDirection = {
        ArrowUp: DIR_UP,
        ArrowDown: DIR_DOWN,
        ArrowLeft: DIR_LEFT,
        ArrowRight: DIR_RIGHT,
    };

    const newDirection = keyToDirection[event.key];
    if (newDirection !== undefined) 
        changeDirection(newDirection);
});

setInterval(drawObject, FRAME_DELAY);