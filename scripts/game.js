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

  let inPlay = false;

  let bird

  let turrets = [];

  let selectedNewPiece;
  let selectedGamePiece;

  const initVars = () => {
    lastTimeStamp = performance.now();
    graphics.generateCells();

    // for example
    bird = pieces.creep({
      center: {
          x: graphics.cells[0][0].center.x,
          y: graphics.cells[0][0].center.y,
      },
      size: {
          x: 50,
          y: 50,
      },
      roation: 0,
      type: 'bird'
  })
    bird.setCells(graphics.cells)
    console.log(bird)
    
    cancelNextRequest = true;
    showGrid = true;
    showDescription = false;
    time = 0;
    selectedNewPiece = null;
    selectedGamePiece = null;
    inPlay = false;
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
    radius: 100,
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
    radius: 100,
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
    radius: 100,
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


    let birdRender = renderer.AnimatedModel({
            spriteSheet: "assets/creeps/bird-west.png",
            spriteCount: 3,
            spriteTime: [100, 100, 100],
        },
        graphics
    )

  // END OF STATE VARIABLES

  const handleMouse = (e) => {

    let loc = { x: e.offsetX, y: e.offsetY };

    if (!selectedNewPiece) {
      if (utils.isInside(loc, startButton)) {
        console.log("start");
        inPlay = true;
      }
      if (utils.isInside(loc, resetButton)) {
        if(!inPlay) {
          turrets = [];
        }
      }
      if (utils.isInside(loc, showGridButton)) {
        showGrid = !showGrid;
      }
      if (utils.isInside(loc, upgradeButton)) {
        console.log("upgrade");
      }
      if (utils.isInside(loc, airTurretIcon)) {
        selectedNewPiece =  pieces.turret(utils.copyTurret(airTurretIcon));
        selectedGamePiece = null;
      } else if (utils.isInside(loc, groundTurretIcon)) {
        selectedNewPiece = pieces.turret(utils.copyTurret(groundTurretIcon));
        selectedGamePiece = null;
      } else if (utils.isInside(loc, bombIcon)) {
        selectedNewPiece = pieces.turret(utils.copyTurret(bombIcon));
        selectedGamePiece = null;
      } 
    } else {
      if(utils.isInside(selectedNewPiece, graphics.gameGrid)) {
        let closest = utils.findClosestCell(selectedNewPiece.center, graphics.cells)
        let newPiece = {...selectedNewPiece, center: closest.center};
        turrets.push(newPiece);
        graphics.occupyCell(closest.loc.x, closest.loc.y, newPiece)
        console.log(turrets)
      }
      selectedNewPiece = null;
    }

    if(!selectedGamePiece) {
      for(let t of turrets) {
        if(utils.isInside(loc, t)) {
          selectedGamePiece = t;
          break;
        }
      }
    } else {
      selectedGamePiece = null;
    }
  };

  const handleMouseMove = (e) => {
    let loc = { x: e.offsetX, y: e.offsetY };

    if (selectedNewPiece) {
      selectedNewPiece.setCenter({ ...loc });
      if(utils.isInside(loc, graphics.gameGrid)) {
        selectedNewPiece.setShowRadius(true);
      } else {
        selectedNewPiece.setShowRadius(false);
      }
    }
    if(selectedGamePiece) {
      if(utils.isInside(loc, graphics.gameGrid)) {
        selectedGamePiece.setShowRadius(true);
      } else {
        selectedGamePiece.setShowRadius(false);
      }
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
    birdRender.update(elapsedTime);
  }

  function render() {
    graphics.clear();

    if(selectedNewPiece?.showRadius) {
      graphics.drawCircle(selectedNewPiece, '#6699CC');
    }
    if(selectedGamePiece?.showRadius) {
      graphics.drawCircle(selectedGamePiece, '#6699CC');
    }

    if (showGrid) {
      graphics.drawGrid();
    }
    graphics.drawBorder();

    birdRender.render(bird);

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

    for(let turret of turrets) {
      renderer.Model.render(turret);
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
