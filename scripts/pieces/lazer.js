MyGame.pieces.lazer = function (spec) {
  "use strict";

  let imageReady = false;
  let image = new Image();

  let moveRate = spec.moveRate || 0.1;

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;

  const updateMovement = (elapsedTime) => {
    let dist = (moveRate * elapsedTime);
    let newX = spec.center.x - dist * Math.cos(spec.angle);
    let newY = spec.center.y - dist * Math.sin(spec.angle);

    spec.center.x = newX;
    spec.center.y = newY;
  };

  return {
    get x() {
      return spec.center.x;
    },
    get y() {
      return spec.center.y;
    },
    get center() {
      return spec.center;
    },
    get size() {
        return spec.size;
    },
    get image() {
      return image;
    },
    get imageReady() {
      return imageReady;
    },
    get angle() {
      return spec.angle || 0;
    },
    updateMovement,
  };
};
