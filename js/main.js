const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Runner = Matter.Runner;
const engine = Engine.create();

const WORLDWIDTH = 900;
const WORLDHEIGHT = WORLDWIDTH / 16 * 9;

const render = Render.create({
  element: document.getElementById('canvas'),
  engine: engine,
  options: {
    width: WORLDWIDTH,
    height: WORLDHEIGHT,
    hasBounds: true,
  }
});


const xGrid = 16;
const yGrid = 9;
const startPointX = Math.round(Math.random() * xGrid) * (WORLDWIDTH / xGrid) || (WORLDWIDTH / xGrid) * 1 ;
const startPointY = Math.round(Math.random() * yGrid) * (WORLDHEIGHT / yGrid) || (WORLDHEIGHT / xGrid) * 1;
console.log(startPointX, startPointY);
const ball = new Ball(startPointX, startPointY);
const maze = new Maze(xGrid, yGrid, WORLDWIDTH, WORLDHEIGHT);

engine.world.gravity = {
  x: 0,
  y: 0,
  scale: 0,
};

World.add(engine.world, [ ball.matter, maze.matter ]);

Engine.run(engine);
Render.run(render);



const handleGoFullscreen = () => {
  const canvas = document.querySelector('canvas');
  if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  }
};

/*
* Handlers
*/
let updown = 0;
let leftright = 0;
const FACTOR = 1000; 
const handleDevicemotion = (e) => {
  if (!e) return;
  if (e.gamma) {
    leftright = e.gamma / -FACTOR;
  }
  if (e.beta) {
    updown = e.beta / FACTOR;
  }
};


/*
* Listener
*/

window.addEventListener('devicemotion', handleDevicemotion);
window.addEventListener('deviceorientation', handleDevicemotion);

document.querySelector('button').addEventListener('click', handleGoFullscreen);

/*
* render loop
*/

const update = () => {
  ball.applyForce(updown, leftright);
};

ball.applyForce(0.01, 0);

const runner = Runner.create();
const debug = document.getElementById('debug');
const draw = () => {
  update();
  Engine.update(engine, 1000 / 60, 1);
  Runner.tick(runner, engine, 1000/60);  
  requestAnimationFrame(draw);
};
draw();