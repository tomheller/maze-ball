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
  }

  getRandomGridPoint() {
    const xGridEntity = (render.options.width / this.xGrid);
    const yGridEntity = (render.options.height / this.yGrid);
    const x = Math.floor(Math.random() * this.xGrid);
    const y = Math.floor(Math.random() * this.yGrid);

    return {
      x: x * xGridEntity + xGridEntity / 2,
      y: y * yGridEntity + yGridEntity / 2,
    }
  }


  handleDevicemotion(e) {
    if (!e) return;
    if (e.gamma) {
      this.leftright = e.gamma / -this.FACTOR;
    }
    if (e.beta) {
      this.updown = e.beta / this.FACTOR;
    }
  };


  attachEventHandlers() {
    window.addEventListener('devicemotion', this.handleDevicemotion);
    window.addEventListener('deviceorientation', this.handleDevicemotion);
  }

  detachEventHandlers() {
    window.removeEventListener('devicemotion', this.handleDevicemotion);
    window.removeEventListener('deviceorientation', this.handleDevicemotion);
  }

  update() {
    if (this.ball) {
      console.log('has ball');
      this.ball.applyForce(this.updown, this.leftright);
    }
  }

  startGame() {
    console.log('startgame');
    const startPoint = this.getRandomGridPoint();
    this.ball = new Ball(startPoint.x, startPoint.y);
    this.maze = new Maze(this.xGrid, this.yGrid, render.options.width, render.options.height);

    const goalPoint = this.getRandomGridPoint();
    this.goal = new Goal(goalPoint.x, goalPoint.y);
    
    World.add(engine.world, [this.ball.matter, this.maze.matter, this.goal.matter]);

    Engine.run(engine);
    Render.run(render);

    this.attachEventHandlers();
    Events.on(engine, 'tick', this.update);
  }

  stopGame() {
    Events.off(engine, 'tick', this.update);
    this.detachEventHandlers();
    Engine.clear(engine);
    Render.stop(render);
    World.clear(engine.world, false);
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
  currentGame = new Game();
  e.target.innerHTML = 'Stop game';
  const canvas = document.querySelector('canvas');
  if (canvas.webkitRequestFullscreen) {
    //canvas.webkitRequestFullscreen();
    currentGame.startGame();
  }
};

/*
* Listener
*/

document.querySelector('button').addEventListener('click', handleStartGame);

/*
* render loop
*/
