//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens["gameplay"] = (function (
  systems,
  renderer,
  assets,
  graphics,
  router,
  pieces,
  input,
  utils
) {
  "use strict";

  // STATE VARIABLES

  let keyboard = input.Keyboard();
  let mouse = input.Mouse();

  let lastTimeStamp;
  let cancelNextRequest = true;
  let showGrid;
  let showDescription;
  let time = 0;

  let level = 1;
  let lives = 3;
  let gold = 100;

  let selectedNewPiece;

  const initVars = () => {
    lastTimeStamp = performance.now();
    cancelNextRequest = true;
    showGrid = true;
    showDescription = false;
    time = 0;
    selectedNewPiece = null;
  };

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

  let startButton = pieces.button({
    center: {
      x: 650,
      y: 100,
    },
    size: {
      x: 90,
      y: 40,
    },
    roation: 0,
    imageSrc: "assets/buttons/start-button.png",
  });

  let resetButton = pieces.button({
    center: {
      x: 750,
      y: 100,
    },
    size: {
      x: 90,
      y: 40,
    },
    roation: 0,
    imageSrc: "assets/buttons/reset-button.png",
  });

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
  });
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
  });
  let bombIcon = pieces.turret({
    center: {
      x: 660 + graphics.gameGrid.cellWidth * 2,
      y: 170,
    },
    size: {
      x: graphics.gameGrid.cellWidth,
      y: graphics.gameGrid.cellWidth,
    },
    roation: 0,
    imageSrc: "assets/guns/bomb-1.png",
  });

  let description = pieces.button({
    center: { x: 700, y: 285 },
    size: {
      x: 110,
      y: 175,
    },
    roation: 0,
    imageSrc: "assets/descriptions/ground-turret-1-description.png",
  });

  let upgradeButton = pieces.button({
    center: { x: 650, y: 400 },
    size: {
      x: 90,
      y: 40,
    },
    roation: 0,
    imageSrc: "assets/buttons/upgrade-button.png",
  });
  let showGridButton = pieces.button({
    center: { x: 750, y: 400 },
    size: {
      x: 90,
      y: 40,
    },
    roation: 0,
    imageSrc: "assets/buttons/show-grid.png",
  });

  //   let birdRender = renderer.AnimatedModel({
  //           spriteSheet: "assets/creeps/bird-west.png",
  //           spriteCount: 3,
  //           spriteTime: [100, 100, 100],
  //       },
  //       graphics
  //   )

  //   let bird = {
  //       center: {
  //           x: 40,
  //           y: 40,
  //       },
  //       size: {
  //           x: 50,
  //           y: 50,
  //       },
  //       roation: 0
  //   }

  // END OF STATE VARIABLES

  const handleMouse = (e) => {
    let loc = { x: e.offsetX, y: e.offsetY };
    if (!selectedNewPiece) {
      if (utils.isInside(loc, startButton)) {
        console.log("start");
      }
      if (utils.isInside(loc, resetButton)) {
        console.log("reset");
      }
      if (utils.isInside(loc, showGridButton)) {
        showGrid = !showGrid;
      }
      if (utils.isInside(loc, upgradeButton)) {
        console.log("upgrade");
      }
      if (utils.isInside(loc, airTurretIcon)) {
        selectedNewPiece = { ...airTurretIcon };
      } else if (utils.isInside(loc, groundTurretIcon)) {
        selectedNewPiece = {...groundTurretIcon};
      } else if (utils.isInside(loc, bombIcon)) {
        selectedNewPiece = { ...bombIcon };
      } 
    }
  };

  const handleMouseMove = (e) => {
    let loc = { x: e.offsetX, y: e.offsetY };

    if (selectedNewPiece) {
      selectedNewPiece.setCenter({ ...loc });
    }

    // TODO: make the menu portion change based off of upgrades
    if(!selectedNewPiece) {
      if (utils.isInside(loc, bombIcon)) {
        showDescription = true;
        let newSrc = `assets/descriptions/bomb-${1}-description.png`;
        if (newSrc !== description.imageSrc) {
          description.changeImage(newSrc);
        }
      } else if (utils.isInside(loc, airTurretIcon)) {
        showDescription = true;
        let newSrc = `assets/descriptions/air-turret-${1}-description.png`;
        if (newSrc !== description.imageSrc) {
          description.changeImage(newSrc);
        }
      } else if (utils.isInside(loc, groundTurretIcon)) {
        showDescription = true;
        let newSrc = `assets/descriptions/ground-turret-${1}-description.png`;
        if (newSrc !== description.imageSrc) {
          description.changeImage(newSrc);
        }
      } else if (showDescription) {
        showDescription = false;
      }
    }
  };

  mouse.register("mousedown", handleMouse);

  mouse.register("mousemove", handleMouseMove);

  function processInput(elapsedTime) {
    keyboard.update(elapsedTime);
    mouse.update(elapsedTime);
  }

  function update(elapsedTime) {
    // update
    // birdRender.update(elapsedTime);
  }

  function render() {
    graphics.clear();
    // graphics.drawRectangle(graphics.gameGrid, "#FF0000", "#FF0000");
    if (showGrid) {
      graphics.drawGrid();
    }
    graphics.drawBorder();

    // birdRender.render(bird);

    renderer.Model.render(groundTurretIcon);
    renderer.Model.render(airTurretIcon);
    renderer.Model.render(bombIcon);
    if (showDescription) {
      renderer.Model.render(description);
    }

    renderer.Text.render(timeText);
    renderer.Text.render(levelText);
    renderer.Text.render(goldText);
    renderer.Text.render(livesText);

    renderer.Model.render(startButton);
    renderer.Model.render(resetButton);
    renderer.Model.render(upgradeButton);
    renderer.Model.render(showGridButton);

    if (selectedNewPiece) {
      renderer.Model.render(selectedNewPiece);
    }
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
    initVars();
    console.log("running!");
    lastTimeStamp = performance.now();
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
  };
})(
  MyGame.systems,
  MyGame.render,
  MyGame.assets,
  MyGame.graphics,
  MyGame.router,
  MyGame.pieces,
  MyGame.input,
  MyGame.utils
);
