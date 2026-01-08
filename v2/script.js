// DIRECTION ENUMS
const DIR_UP = 0;
const DIR_DOWN = 2;
const DIR_LEFT = 3;
const DIR_RIGHT = 1;

// LOGICAL SIZES : These are fixed and exist independent of the visual representation
const SNAKE_STEP = 1;
const FOOD_CELL_SIZE = 1;
const SNAKE_CELL_SIZE = 1;
const GRID_WIDTH_CELLS = 100;
const GRID_HEIGHT_CELLS = 100;

// VISUAL RULES
const CELL_SIZE_PX = 5;
const FRAME_DELAY = 60;
const FOOD_COLOR = 'red';
const SNAKE_COLOR = 'black';
const CANVAS_BG_COLOR = 'yellow';

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

        // snake nodes

        // drawing food

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
    constructor(){
        this.head = new SnakeNode(0, 0);
        this.tail = this.head;
        this.length = 1;
        this.size = SNAKE_CELL_SIZE;
        this.stepsize = SNAKE_STEP;
        this.direction = DIR_RIGHT; // initial direction
    }
}

class Food {
    constructor(){
    }
}

class InputHandler {

}

class GameState {
    constructor(snake, food){
        this.snake = snake;
        this.food = food;
    }
}

class GameLoop {
    constructor(gameState, graphicsEngine, renderer){
        this.graphicsEngine = graphicsEngine;
        this.gameState = gameState;
        this.renderer = renderer;
    }
    
    update(){
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

// Derived Values
const CANVAS_X = 10;
const CANVAS_Y = 10;
const CANVAS_WIDTH = GRID_HEIGHT_CELLS * CELL_SIZE_PX;
const CANVAS_HEIGHT = GRID_WIDTH_CELLS * CELL_SIZE_PX;

// INITIAL POSITIONS
const SNAKE_INIT_X = (GRID_WIDTH_CELLS / 2) * CELL_SIZE_PX;
const SNAKE_INIT_Y = (GRID_HEIGHT_CELLS / 2) * CELL_SIZE_PX;

// Instantiate Game Entities
const food = new Food();
const snake = new Snake();
const gameState = new GameState(snake, food);
const surface = new DrawCommand(CANVAS_X, CANVAS_Y, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_BG_COLOR);
const graphicsEngine = new GraphicsEngine(surface);
const renderer = new Renderer(surface);
const gameLoop = new GameLoop(gameState, graphicsEngine, renderer);

// start the game
gameLoop.start()