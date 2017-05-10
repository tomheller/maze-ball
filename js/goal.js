class Goal {
  constructor(x = 20, y = 20, rad = 20) {
    this.x = x;
    this.y = y; 
    this.rad = rad; 
    this.matter = Matter.Bodies.circle(this.x, this.y, this.rad, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: '#34bb44',
        strokeStyle: '#34aabb',
      }
    });
  }

}