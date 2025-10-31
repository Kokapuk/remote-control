const getAcceleratedCoords = (x: number, y: number, accelerationThreshold: number, maxAccelerationFactor: number) => {
  const speed = Math.sqrt(x * x + y * y);

  const acceleration = 1 + Math.min(speed / accelerationThreshold, maxAccelerationFactor);
  const acceleratedX = x * acceleration;
  const acceleratedY = y * acceleration;

  return [acceleratedX, acceleratedY];
};

export default getAcceleratedCoords;
