//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens["gameplay"] = (function(
    systems,
    renderer,
    assets,
    graphics,
    router
) {
    "use strict";

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;


    function update(elapsedTime) {
        // update
    }

    function render() {
        graphics.clear();
        // graphics.drawRectangle(graphics.gameGrid, "#FF0000", "#FF0000");
        graphics.drawGrid();
        graphics.drawBorder();
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;

        update(elapsedTime);
        lastTimeStamp = time;

        render();

        requestAnimationFrame(gameLoop);
    }

    //------------------------------------------------------------------
    //
    // Want to expose this to allow the loader code to call this when all
    // is ready to go.
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log("game initializing...");
        // requestAnimationFrame(gameLoop);
        document.getElementById("game-to-main").addEventListener("click", () => {
            cancelNextRequest = true;
            router.showScreen("main-menu");
        });
    }

    function run() {
        console.log('running!');
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
})(
    MyGame.systems,
    MyGame.render,
    MyGame.assets,
    MyGame.graphics,
    MyGame.router
);