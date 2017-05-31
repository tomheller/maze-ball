const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
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

Engine.run(engine);



let currentGame;
const handleStartGame = (e) => {
  if (currentGame) {
    e.target.innerHTML = 'Start game';
    currentGame.stopGame();
    currentGame = undefined;
    return;
  }
  currentGame = new Game(8, 5);
  e.target.innerHTML = 'Stop game';
  if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  }
  document.querySelector('.ui').remove();
  currentGame.startGame(Math.random() * 1000);
};

/*
* Listener
*/

const canvas = document.querySelector('canvas');
window.addEventListener('win', function() { 
  currentGame = new Game(8, 5);
  currentGame.startGame(Math.random() * 1000);
}, false);
document.querySelector('button').addEventListener('click', handleStartGame);

/*
* render loop
*/