MyGame.pieces.turret = function(spec) {
    "use strict";

    let imageReady = false;
    let image = new Image();

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
        setCenter,
        setShowRadius
    };
};