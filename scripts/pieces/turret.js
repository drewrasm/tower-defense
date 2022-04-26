MyGame.pieces.turret = function(spec) {
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

    let showRadius = false;

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    const setCenter = (loc) => {
        spec.center = loc;
    }

    const setShowRadius = (show) => {
        showRadius = show;
    }

    const priceMap = {
        ground: {
            1: 5,
            2: 10,
            3: 15
        },
        bomb: {
          1: 3,
          2: 5,
          3: 10,
        },
        air: {
            1: 5,
            2: 10,
            3: 15
        }
    }

    const getPrice = (lvl=null) => {
        return priceMap[spec.type][lvl || spec.level]
    }

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
        get radius() {
            return spec.radius;
        },
        get image() {
            return image;
        },
        get imageSrc() {
            return spec.imageSrc;
        },
        get imageReady() {
            return imageReady;
        },
        get showRadius() {
            return showRadius;
        },
        get level() {
            return spec.level;
        },
        get type() {
            return spec.type;
        },
        setCenter,
        setShowRadius,
        changeImage,
        getPrice
    };
};