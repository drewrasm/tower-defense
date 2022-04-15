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

    let birdRender = renderer.AnimatedModel({
            spriteSheet: "assets/creeps/bird-west.png",
            spriteCount: 3,
            spriteTime: [100, 100, 100],
        },
        graphics
    )

    let bird = {
        center: {
            x: 40,
            y: 40,
        },
        size: {
            x: 50,
            y: 50,
        },
        roation: 0
    }

    let turtleRender = renderer.AnimatedModel({
            spriteSheet: "assets/creeps/turtle-south.png",
            spriteCount: 8,
            spriteTime: [100, 100, 100, 100, 100, 100, 100, 100],
        },
        graphics
    )

    let turtle = {
        center: {
            x: 140,
            y: 140,
        },
        size: {
            x: 50,
            y: 50,
        },
        roation: 0
    }

    let knightRender = renderer.AnimatedModel({
            spriteSheet: "assets/creeps/knight-west.png",
            spriteCount: 8,
            spriteTime: [100, 100, 100, 100, 100, 100, 100, 100],
        },
        graphics
    )

    let knight = {
        center: {
            x: 240,
            y: 240,
        },
        size: {
            x: 50,
            y: 50,
        },
        roation: 0
    }


    function update(elapsedTime) {
        // update
        birdRender.update(elapsedTime);
        turtleRender.update(elapsedTime);
        knightRender.update(elapsedTime);
    }

    function render() {
        graphics.clear();
        // graphics.drawRectangle(graphics.gameGrid, "#FF0000", "#FF0000");
        graphics.drawGrid();
        graphics.drawBorder();

        birdRender.render(bird);
        turtleRender.render(turtle);
        knightRender.render(knight);
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