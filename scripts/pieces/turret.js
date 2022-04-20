MyGame.pieces.turret = function(spec) {
    "use strict";

    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    const setCenter = (loc) => {
        spec.center = loc;
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
        get image() {
            return image;
        },
        get imageSrc() {
            return spec.imageSrc;
        },
        get imageReady() {
            return imageReady;
        },
        setCenter
    };
};