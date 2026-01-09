// DIRECTION ENUMS
const DIR_UP = 0;
const DIR_DOWN = 2;
const DIR_LEFT = 3;
const DIR_RIGHT = 1;

// LOGICAL SIZES : These are fixed and exist independent of the visual representation
const SNAKE_STEP = 3;
const FOOD_CELL_SIZE = 3;
const SNAKE_CELL_SIZE = 3;
const GRID_WIDTH_CELLS = 100;
const GRID_HEIGHT_CELLS = 50;

// VISUAL RULES
const CELL_SIZE_PX = 5;
const FRAME_DELAY = 100;
const FOOD_COLOR = 'red';
const SNAKE_COLOR = 'black';
const SNAKE_HEAD_COLOR = 'orange';
const CANVAS_BG_COLOR = 'beige';

/* 
    GraphicsEngine - EXECUTOR : Handles drawing mechanisms

    -> knows how to clear pixels
    -> talks directly to browser's api
    -> has zero idea about what the entities in the game are
*/
class GraphicsEngine {
 constructor(surfaceDrawCommand){
    // setup the canvas
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = surfaceDrawCommand.width;
    this.canvas.height = surfaceDrawCommand.height;
    this.surface = surfaceDrawCommand;
 }

 drawRectangle(drawCommand) {
    this.ctx.fillStyle = drawCommand.color;
    this.ctx.fillRect(drawCommand.x, drawCommand.y, drawCommand.width, drawCommand.height);
 }

 clear(){
    this.drawRectangle(this.surface);
 }
}

/* 
    RENDERER - VISUAL RULES : This decides how entities look like
    It returns just information about what's to be drawn - the information isn't meant to be
    comprehensible, it's just some rectangles that have to be drawn by the GraphicsEngine
*/
class Renderer {

    composeFrame(gameState){
        const drawCommands = [];

        // snake blobs
        const snakeNodes = gameState.snake.getNodes();
        for(let i = 0; i < snakeNodes.length; i++){
            const node = snakeNodes[i];
            if(i === 0){
                // head node will have a different color for better visibility
                drawCommands.push(new DrawCommand(node.x * CELL_SIZE_PX, node.y * CELL_SIZE_PX, SNAKE_CELL_SIZE * CELL_SIZE_PX,  SNAKE_CELL_SIZE * CELL_SIZE_PX, SNAKE_HEAD_COLOR));
                continue;
            }
            drawCommands.push(new DrawCommand(node.x * CELL_SIZE_PX, node.y * CELL_SIZE_PX, SNAKE_CELL_SIZE * CELL_SIZE_PX,  SNAKE_CELL_SIZE * CELL_SIZE_PX, SNAKE_COLOR));
        }

        // food blob
        const foodNode = gameState.food.getNode();
        drawCommands.push(new DrawCommand(foodNode.x * CELL_SIZE_PX, foodNode.y * CELL_SIZE_PX, FOOD_CELL_SIZE * CELL_SIZE_PX, FOOD_CELL_SIZE * CELL_SIZE_PX, FOOD_COLOR));

        return drawCommands;
    }
}

/*
    DrawCommand : This is the visual encoded version of logical information of the game. It's produced by the renderer
    and consumed by the GraphicsEngine.
*/
class DrawCommand {
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

class SnakeNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
    }
}

class Snake {
    constructor(snakeSize, stepSize, initialDirection){
        const newGridCell = randomGridCell(GRID_WIDTH_CELLS - snakeSize, GRID_HEIGHT_CELLS - snakeSize);
        this.head = new SnakeNode(newGridCell.x, newGridCell.y);
        this.tail = this.head;
        this.length = 1;
        this.size = snakeSize;
        this.stepsize = stepSize;
        this.direction = initialDirection;
    }

    tick(shouldGrow){
        // compute new head position
        let newX = this.head.x;
        let newY = this.head.y;

        switch(this.direction){
            case DIR_UP:
                newY -= this.stepsize;
                break;
            case DIR_DOWN:
                newY += this.stepsize;
                break;
            case DIR_LEFT:
                newX -= this.stepsize;
                break;
            case DIR_RIGHT:
                newX += this.stepsize;
                break;
        }

        // making sure snake never leaves the grid
        newX = (newX + GRID_WIDTH_CELLS) % GRID_WIDTH_CELLS;
        newY = (newY + GRID_HEIGHT_CELLS) % GRID_HEIGHT_CELLS;

        // add new head to the snake
        const newHead = new SnakeNode(newX, newY);
        newHead.next = this.head;
        this.head = newHead;
        this.length++;

        // remove tail unless the snake is supposed to grow
        if(!shouldGrow){
            let curr = this.head;
            while(curr.next !== this.tail){
                curr = curr.next;
            }
            this.tail = curr;
            curr.next = null;
            this.length--;
        }
    }

    changeDirection(newDirection) {
        const opposites = {
            [DIR_UP]: DIR_DOWN,
            [DIR_DOWN]: DIR_UP,
            [DIR_LEFT]: DIR_RIGHT,
            [DIR_RIGHT]: DIR_LEFT
        };

        if (newDirection !== null &&
            opposites[this.direction] !== newDirection) {
            this.direction = newDirection;
        }
    }

    getNodes(){
        const nodes = [];
        let curr = this.head;
        // iterating the linked list
        while(curr){
            nodes.push({x: curr.x, y: curr.y});
            curr = curr.next;
        }
        return nodes;
    }
}

class Food {
    constructor(){
        this.spawn();
    }

    spawn(){
        const randomCell = randomGridCell(GRID_WIDTH_CELLS - FOOD_CELL_SIZE, GRID_HEIGHT_CELLS - FOOD_CELL_SIZE);
        this.x = randomCell.x;
        this.y = randomCell.y;
    }

    getNode(){
        return {x: this.x, y: this.y};
    }
}

class InputHandler {
    constructor() {
        this.pendingDirection = null;

        document.addEventListener("keydown", (event) => {
            const keyToDirection = {
                ArrowUp: DIR_UP,
                ArrowDown: DIR_DOWN,
                ArrowLeft: DIR_LEFT,
                ArrowRight: DIR_RIGHT,
            };

            const dir = keyToDirection[event.key];
            if (dir !== undefined) {
                this.pendingDirection = dir;
            }
        });
    }

    consumeDirection() {
        const dir = this.pendingDirection;
        this.pendingDirection = null;
        return dir;
    }
}

class GameState {
    constructor(snake, food){
        this.snake = snake;
        this.food = food;
    }

    didSnakeEat(){
        return checkOverlap(this.food.x, this.food.x + FOOD_CELL_SIZE, this.snake.head.x, this.snake.head.x + SNAKE_CELL_SIZE)
        && checkOverlap(this.food.y, this.food.y + FOOD_CELL_SIZE, this.snake.head.y, this.snake.head.y + SNAKE_CELL_SIZE);
    }
}

class GameLoop {
    constructor(gameState, graphicsEngine, renderer, inputHandler){
        this.graphicsEngine = graphicsEngine;
        this.gameState = gameState;
        this.renderer = renderer;
        this.inputHandler = inputHandler;
    }
    
    update(){
        const snakeAte = this.gameState.didSnakeEat();
        this.gameState.snake.tick(snakeAte);
        const newDirection = this.inputHandler.consumeDirection();
        this.gameState.snake.changeDirection(newDirection);        
        if(snakeAte)
            this.gameState.food.spawn();        
    }

    render(){
        // clear the surface
        this.graphicsEngine.clear();

        const drawCommands = this.renderer.composeFrame(this.gameState);
        for(let cmd of drawCommands){
            this.graphicsEngine.drawRectangle(cmd);
        }
    }

    tick(){
        this.update();
        this.render();
    }

    start(){
        setInterval(() => this.tick(), FRAME_DELAY);
    }
}

// returns a cell from the (0, 0, width, height) grid
function randomGridCell(width, height){
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
}

// checks overlap of two line segments (x1, y1) & (x2, y2)
function checkOverlap(x1, y1, x2, y2){
    if(x2 > y1 || y2 < x1)
        return false;
    return true;
}

// Derived Values
const CANVAS_WIDTH = GRID_WIDTH_CELLS * CELL_SIZE_PX;
const CANVAS_HEIGHT = GRID_HEIGHT_CELLS * CELL_SIZE_PX;

// Instantiate Game Entities
const food = new Food();
const snake = new Snake(SNAKE_CELL_SIZE, SNAKE_STEP, DIR_RIGHT);
const gameState = new GameState(snake, food);
const surface = new DrawCommand(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_BG_COLOR);
const graphicsEngine = new GraphicsEngine(surface);
const renderer = new Renderer();
const inputHandler = new InputHandler();
const gameLoop = new GameLoop(gameState, graphicsEngine, renderer, inputHandler);

// start the game
gameLoop.start()