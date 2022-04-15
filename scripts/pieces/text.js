MyGame.pieces.text = function(spec) {
    "use strict";

    function updateText(updatedText) {
        return (spec.text = updatedText);
    }

    let that = {
        updateText: updateText,
        get position() {
            return spec.position;
        },
        get text() {
            return spec.text;
        },
        get font() {
            return spec.font;
        },
        get fillStyle() {
            return spec.fillStyle;
        },
        get strokeStyle() {
            return spec.strokeStyle;
        },
    };

    return that;
};