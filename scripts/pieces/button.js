MyGame.pieces.button = function (spec) {
  "use strict";

  let imageReady = false;
  let image = new Image();

  const initializeImage = (newImage = null) => {
    image.onload = function () {
      imageReady = true;
    };
    image.src = newImage || spec.imageSrc;
  };

  initializeImage();

  const changeImage = (newSrc) => {
    spec.imageSrc = newSrc;
    initializeImage();
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
    get width() {
      return spec.width;
    },
    get height() {
      return spec.height;
    },
    get image() {
      return image;
    },
    get imageReady() {
      return imageReady;
    },
    changeImage,
  };
};
