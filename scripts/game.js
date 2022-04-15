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
    router,
    pieces,
    input
) {
    "use strict";

    // STATE VARIABLES 

    let keyboard = input.Keyboard();
    let mouse = input.Mouse();

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let showGrid = true;

    let level = 1;
    let lives = 3;
    let gold = 100;



    let time = 0;
    let timeText = pieces.text({
        text: `Time ${time}`,
        font: `${20}px Arial`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 25, y: 2 },
    });
    let levelText = pieces.text({
        text: `Level ${level}`,
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 175, y: 2 },
    });
    let livesText = pieces.text({
        text: `Lives ${lives}`,
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 375, y: 2 },
    });
    let goldText = pieces.text({
        text: `Gold ${gold}`,
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 575, y: 2 },
    });

    let startButton = pieces.text({
        text: 'Start',
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 625, y: 100 },
    })

    let resetButton = pieces.text({
        text: 'Reset',
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 700, y: 100 },
    })

    let groundTurretIcon = pieces.turret({
        center: {
            x: 640,
            y: 170,
        },
        size: {
            x: graphics.gameGrid.cellWidth,
            y: graphics.gameGrid.cellWidth,
        },
        roation: 0,
        imageSrc: "assets/guns/ground-turret-1.png",
    })
    let airTurretIcon = pieces.turret({
        center: {
            x: 650 + graphics.gameGrid.cellWidth,
            y: 170,
        },
        size: {
            x: graphics.gameGrid.cellWidth,
            y: graphics.gameGrid.cellWidth,
        },
        roation: 0,
        imageSrc: "assets/guns/air-turret-1.png",
    })
    let bombIcon = pieces.turret({
        center: {
            x: 660 + (graphics.gameGrid.cellWidth * 2),
            y: 170,
        },
        size: {
            x: graphics.gameGrid.cellWidth,
            y: graphics.gameGrid.cellWidth,
        },
        roation: 0,
        imageSrc: "assets/guns/bomb-1.png",
    })
    let upgradeButton = pieces.text({
        text: 'Upgrade',
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 650, y: 400 },
    })
    let showGridButton = pieces.text({
        text: 'Show Grid',
        font: `${20}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: { x: 650, y: 425 },
    })

    // let birdRender = renderer.AnimatedModel({
    //         spriteSheet: "assets/creeps/bird-west.png",
    //         spriteCount: 3,
    //         spriteTime: [100, 100, 100],
    //     },
    //     graphics
    // )

    // let bird = {
    //     center: {
    //         x: 40,
    //         y: 40,
    //     },
    //     size: {
    //         x: 50,
    //         y: 50,
    //     },
    //     roation: 0
    // }

    // END OF STATE VARIABLES 

    const handleMouse = (e) => {
        console.log(e)
        console.log('click!')
    };

    mouse.register('mousedown', handleMouse);

    function processInput(elapsedTime) {
        keyboard.update(elapsedTime);
        mouse.update(elapsedTime)
    }

    function update(elapsedTime) {
        // update
        // birdRender.update(elapsedTime);
        // turtleRender.update(elapsedTime);
        // knightRender.update(elapsedTime);
    }

    function render() {
        graphics.clear();
        // graphics.drawRectangle(graphics.gameGrid, "#FF0000", "#FF0000");
        if (showGrid) {
            graphics.drawGrid();
        }
        graphics.drawBorder();

        // birdRender.render(bird);
        // turtleRender.render(turtle);
        // knightRender.render(knight);
        // renderer.Model.render(turret);
        // renderer.Model.render(bomb);
        renderer.Model.render(groundTurretIcon);
        renderer.Model.render(airTurretIcon);
        renderer.Model.render(bombIcon);

        renderer.Text.render(timeText)
        renderer.Text.render(levelText)
        renderer.Text.render(goldText)
        renderer.Text.render(livesText)
        renderer.Text.render(startButton)
        renderer.Text.render(resetButton)
        renderer.Text.render(upgradeButton)
        renderer.Text.render(showGridButton)
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;

        processInput(elapsedTime);
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
    MyGame.router,
    MyGame.pieces,
    MyGame.input
);