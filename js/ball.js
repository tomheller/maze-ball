class Ball {
  constructor (x = 20, y = 20, rad = 15) {
    this.x = x;
    this.y = y; 
    this.rad = rad; 
    this.matter = Matter.Bodies.circle(this.x - this.rad, this.y - this.rad, this.rad, {
      mass: 60,
    });
  }

  applyForce (x, y) {
    const pos = this.matter.position;
    const force = Matter.Vector.create(x, y);
    Matter.Body.applyForce(this.matter, pos, force);
  }

}