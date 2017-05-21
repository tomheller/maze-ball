
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
    this.update = this.updateState.bind(this);
    this.collision = this.handleCollision.bind(this);
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

  updateState(e) {
    if (this.ball) {
      this.ball.applyForce(this.updown, this.leftright);
    }
  }

  handleCollision(e) {
    const pair = e.pairs;
    if ( !pair.length ) return;
    if ( pair[0].bodyA === this.goal.matter || pair[0].bodyB === this.goal.matter ) {
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
  
    Render.run(render);

    this.attachEventHandlers();
    this.updown = 0;
    this.leftright = 0;
    Events.on(engine, 'beforeUpdate', this.update);
    Events.on(engine, 'collisionStart', this.collision);
  }

  stopGame() {
    Events.off(engine, 'beforeUpdate', this.update);
    Events.off(engine, 'collisionStart', this.collision);
    this.detachEventHandlers();
    World.clear(engine.world, false);
    Engine.clear(engine);
    Render.stop(render);
  }

  showWinScreen() {
    const evt = new Event('win');
    window.dispatchEvent(evt);
  }
}