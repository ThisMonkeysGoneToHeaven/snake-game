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
const SNAKE_COLOR = 'black';
const FOOD_COLOR = 'red';
const FRAME_DELAY = 60;
const CANVAS_BG_COLOR = 'yellow';

/* 
    GraphicsEngine - EXECUTOR : Handles drawing mechanisms

    -> knows how to clear pixels
    -> talks directly to browser's api
    -> has zero idea about what the entities in the game are

    * Is directly coupled with DrawingSurface class because CanvasJS needs to know height/width of the surface to boot up
*/
class GraphicsEngine {
 constructor(drawingSurface){
    // setup the canvas
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = drawingSurface.width;
    this.canvas.height = drawingSurface.height;
 }

 drawRectangle(drawCommand) {
    this.ctx.fillStyle = drawCommand.color;
    this.ctx.fillRect(drawCommand.x, drawCommand.y, drawCommand.width, drawCommand.height);
 }
}

/* 
    RENDERER - VISUAL RULES : This decides how entities look like
    It returns just information about what's to be drawn - the information isn't meant to be
    comprehensible, it's just some rectangles that have to be drawn by the GraphicsEngine
*/
class Renderer {
    constructor(surface, snake, food){
        this.surface = surface;
        this.snake = snake;
        this.food = food;
    }

    composeFrame(){
        const drawCommands = [];

        // game surface
        drawCommands.push(new DrawCommand(0, 0, this.surface.height, this.surface.width, this.surface.bgcolor));

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
    constructor(x, y, height, width, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

/* 
    DrawingSurface - ENTITY : Background Surface in which the Game lies visually
*/
class DrawingSurface {
 constructor(height, width, bgcolor){
    this.width = width;
    this.height = height;
    this.bgcolor = bgcolor;
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
        this.color = FOOD_COLOR;
        this.size = FOOD_SIZE;
    }
}

class InputHandler {

}

class GamePlay {

}

// Derived Values
const CANVAS_WIDTH = GRID_HEIGHT_CELLS * CELL_SIZE_PX;
const CANVAS_HEIGHT = GRID_WIDTH_CELLS * CELL_SIZE_PX;

// Define entities
const food = new Food();
const snake = new Snake();
const surface = new DrawingSurface(CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_BG_COLOR);
const graphicsEngine = new GraphicsEngine(surface);

setInterval(() => {
}, FRAME_DELAY)