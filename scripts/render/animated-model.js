MyGame.render.AnimatedModel = function (spec, graphics) {
  "use strict";

  let animationTime = 0;
  let subImageIndex = 0;
  let subTextureWidth = 0;
  let image = new Image();
  let isReady = false; // Can't render until the texture is loaded

  const initializeImage = (newImage = null) => {
    image.onload = function () {
      isReady = true;
      subTextureWidth = image.width / spec.spriteCount;
    };
    image.src = newImage || spec.spriteSheet;
  };

  const changeImage = (newImage) => {
    // set the new image
    spec.spriteSheet = newImage;
    initializeImage(newImage);
  };

  initializeImage(spec.spriteSheet);

  image.onload = function () {
    isReady = true;
    subTextureWidth = image.width / spec.spriteCount;
  };

  function update(elapsedTime) {
    animationTime += elapsedTime;
    if (animationTime >= spec.spriteTime[subImageIndex]) {
      animationTime -= spec.spriteTime[subImageIndex];
      subImageIndex += 1;
      subImageIndex = subImageIndex % spec.spriteCount;
    }
  }

  function render(model) {
    if (isReady) {
      graphics.drawSubTexture(
        image,
        subImageIndex,
        subTextureWidth,
        model.center,
        model.rotation,
        model.size
      );
    }
  }

  let api = {
    update: update,
    render: render,
    changeImage,
  };

  return api;
};
