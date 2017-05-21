const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Runner = Matter.Runner;
const Events = Matter.Events;
const engine = Engine.create();

const render = Render.create({
  element: document.getElementById('canvas'),
  engine: engine,
  options: {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    hasBounds: true,
    wireframes: false,
    background: '#454546',
  }
});

engine.world.gravity = {
  x: 0,
  y: 0,
  scale: 0,
};

class Game {
  constructor(xGrid = 16, yGrid = 9) {
    this.xGrid = xGrid;
    this.yGrid = yGrid;

    this.FACTOR = 1000;
    this.updown = 0;
    this.leftright = 0;
    this.devicemotion = this.handleDevicemotion.bind(this);
    this.keyboardMotionDown = this.handleKeyboardMotionDown.bind(this);
    this.keyboardMotionUp = this.handleKeyboardMotionUp.bind(this);
  }

  getRandomGridPoint() {
    const xGridEntity = (render.options.width / this.xGrid);
    const yGridEntity = (render.options.height / this.yGrid);
    const x = Math.floor(random() * this.xGrid);
    const y = Math.floor(random() * this.yGrid);

    return {
      x: x * xGridEntity + xGridEntity / 2,
      y: y * yGridEntity + yGridEntity / 2,
    }
  }


  handleDevicemotion(e) {
    if (!e) return;
    if (e.beta) {
      this.leftright = e.beta / this.FACTOR;
    }
    if (e.gamma) {
      this.updown = e.gamma / this.FACTOR;
    }
  };

  handleKeyboardMotionDown(e) {
    const f = 0.01;
    console.log('keydown')
    switch (e.keyCode) {
      case 37:
        // left
        this.updown -= f;
        break;
      case 38:
        this.leftright -= f;
        // up
        break;
      case 39: 
        this.updown += f;
        // right
        break;
      case 40:
        this.leftright += f;
        // down
        break;
    }
  }

  handleKeyboardMotionUp(e) {
    const f = 0.01;
    switch (e.keyCode) {
      case 37:
      case 39: 
        // right
        // left
        this.updown = 0;
        break;
      case 38:
      case 40:
        // up
        // down
        this.leftright = 0;
        break;
    }
  }

  attachEventHandlers() {
    window.addEventListener('devicemotion', this.devicemotion);
    window.addEventListener('deviceorientation', this.devicemotion);
    window.addEventListener('keydown', this.keyboardMotionDown);
    window.addEventListener('keyup', this.keyboardMotionUp);
  }

  detachEventHandlers() {
    window.removeEventListener('devicemotion', this.devicemotion);
    window.removeEventListener('deviceorientation', this.devicemotion);
    window.removeEventListener('keydown', this.keyboardMotionDown);
    window.removeEventListener('keyup', this.keyboardMotionUp);
  }

  update() {
    if (this.ball) {
      this.ball.applyForce(this.updown, this.leftright);
    }
  }

  collision(e) {
    const pair = e.pairs;
    if (pair[0].bodyA === this.goal.matter || pair[0].bodyB === this.goal.matter ) {
      this.stopGame();
      this.showWinScreen();
    }
  }

  startGame(s) {
    console.log('startgame');
    seed = s || 0;
    const startPoint = this.getRandomGridPoint();
    this.ball = new Ball(startPoint.x, startPoint.y);
    this.maze = new Maze(this.xGrid, this.yGrid, render.options.width, render.options.height);

    const goalPoint = this.getRandomGridPoint();
    this.goal = new Goal(goalPoint.x, goalPoint.y);
    
    World.add(engine.world, [this.ball.matter, this.maze.matter, this.goal.matter]);

    Engine.run(engine);
    Render.run(render);

    this.attachEventHandlers();
    Events.on(engine, 'beforeTick', function() {this.update()}.bind(this));
    Events.on(engine, 'collisionStart', function(e) {this.collision(e)}.bind(this))
  }

  stopGame() {
    Events.off(engine, 'beforeTick', this.update);
    this.detachEventHandlers();
    Engine.clear(engine);
    Render.stop(render);
    World.clear(engine.world, false);
  }

  showWinScreen() {
    const evt = new Event('win');
    window.dispatchEvent(evt);
  }
}


let currentGame;
const handleStartGame = (e) => {
  if (currentGame) {
    e.target.innerHTML = 'Start game';
    currentGame.stopGame();
    currentGame = undefined;
    return;
  }
  currentGame = new Game(3, 5);
  e.target.innerHTML = 'Stop game';
  if (canvas.webkitRequestFullscreen) {
    // canvas.webkitRequestFullscreen();
    currentGame.startGame(Math.random() * 1000);
  }
};

/*
* Listener
*/

const canvas = document.querySelector('canvas');
window.addEventListener('win', function() { 
  console.log('winner winner chicken dinner');
}, false);
document.querySelector('button').addEventListener('click', handleStartGame);

/*
* render loop
*/
