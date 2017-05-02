class Maze {

  static get NORTH() { return 'N' };
  static get SOUTH() { return 'S' };
  static get EAST() { return 'E' };
  static get WEST() { return 'W' };

  static get DX() {
    const dX = {};
    dX[Maze.NORTH] = 0;
    dX[Maze.SOUTH] = 0;
    dX[Maze.EAST] = 1;
    dX[Maze.WEST] = -1;
    return dX;
  }

  static get DY() {
    const dY = {};
    dY[Maze.NORTH] = -1;
    dY[Maze.SOUTH] = 1;
    dY[Maze.EAST] = 0;
    dY[Maze.WEST] = 0;
    return dY;
  }

  static get OPPOSITE() {
    const op = {};
    op[Maze.NORTH] = Maze.SOUTH;
    op[Maze.SOUTH] = Maze.NORTH;
    op[Maze.EAST] = Maze.WEST;
    op[Maze.WEST] = Maze.EAST;
    return op;
  }

  constructor(width, height, canvasWidth, canvasHeight) {
    const wallOpts = {
      isStatic: true,
    };

    this.width = width;
    this.height = height;

    this.blockWidth = canvasWidth / width;
    this.blockHeight = canvasHeight / height;

    this.matter = Matter.Composite.create(wallOpts);

    this.grid = new Array(height)
    for(var i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(width);
    }
    this.carvePassageFrom(0, 0, this.grid);

    this.printGrid();
    // Matter.Composite.add(this.matter, this.generateWall(1,0));
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        Matter.Composite.add(this.matter, this.generateWall(j, i));
      }
    }
  }

  getPointInDirection(x, y, dir) {
    const newXPoint = x + Maze.DX[dir];
    const newYPoint = y + Maze.DY[dir];

    // early exit if new X is out of bounds
    if (newXPoint < 0 || newXPoint >= this.width) {
      return;
    }
    
    // early exit if new Y is out of bounds
    if (newYPoint < 0 || newYPoint >= this.height) {
      return;
    }
    return this.grid[newYPoint][newXPoint];
  }

  generateWall(x, y) {
    const walls = Matter.Composite.create({ isStatic: true });
    const gridPoint = this.grid[y][x];
    const opts = { 
      isStatic: true,
      render: {
        fillStyle: '#FF00FF',
      },
    };
    const wallWidth = 10; 

    const northPoint = this.getPointInDirection(x, y, Maze.NORTH);
    if (gridPoint !== Maze.NORTH && northPoint !== Maze.OPPOSITE[Maze.NORTH]) {
      Matter.Composite.add(walls, Matter.Bodies.rectangle(this.blockWidth / 2, 0, this.blockWidth + wallWidth, wallWidth, opts));
    }
    const southPoint = this.getPointInDirection(x, y, Maze.SOUTH);
    if (gridPoint !== Maze.SOUTH && southPoint !== Maze.OPPOSITE[Maze.SOUTH]) {
      Matter.Composite.add(walls, Matter.Bodies.rectangle(this.blockWidth / 2, this.blockWidth, this.blockWidth + wallWidth, wallWidth, opts));
    }
    const westPoint = this.getPointInDirection(x, y, Maze.WEST);
    if (gridPoint !== Maze.WEST && westPoint !== Maze.OPPOSITE[Maze.WEST]) {
      Matter.Composite.add(walls, Matter.Bodies.rectangle(0, this.blockHeight / 2, wallWidth, this.blockHeight + wallWidth, opts));
    }
    const eastPoint = this.getPointInDirection(x, y, Maze.EAST);
    if (gridPoint !== Maze.EAST && eastPoint !== Maze.OPPOSITE[Maze.EAST]) {
      Matter.Composite.add(walls, Matter.Bodies.rectangle(this.blockHeight, this.blockHeight / 2, wallWidth, this.blockHeight + wallWidth, opts));
    }
    
    const translate = Matter.Vector.create(x * this.blockWidth, y * this.blockHeight);
    Matter.Composite.translate(walls, translate);
    
    return walls;
  }

  carvePassageFrom(x, y, grid) {
    const directions = [Maze.NORTH, Maze.SOUTH, Maze.EAST, Maze.WEST]
      .sort(f => 0.5 - Math.random());
    
    directions.forEach(dir => {
      const nX = x + Maze.DX[dir];
      const nY = y + Maze.DY[dir];
      const withinWidth = nX >= 0 && nX < this.width;
      const withinHeight = nY >= 0 && nY < this.height;

      if (withinWidth && withinHeight && grid[nY][nX] == undefined) {
        grid[y][x] = grid[y][x] || dir;
        grid[nY][nX] = grid[nY][nX] || Maze.OPPOSITE[dir];
        this.carvePassageFrom(nX, nY, grid);
      }
    }); 
  }

  printGrid() {
    this.grid.forEach(e => console.log(e.join(' | ')));
  }
}