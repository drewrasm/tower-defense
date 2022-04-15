MyGame.renderer.Text = (function(graphics) {
    "use strict";

    function render(spec) {
        graphics.drawText(spec);
    }

    return {
        render: render,
    };
})(MyGame.graphics);