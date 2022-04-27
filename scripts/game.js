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
  let score = 0;
  let level = 1;
  let wave = 1;
  let gold = 10;


  let shotAudio = new Audio();
  shotAudio.src = 'assets/sounds/shot.mp3';

  let deathAudio = new Audio();
  deathAudio.src = 'assets/sounds/death.mp3';

  let punchAudio = new Audio();
  punchAudio.src = 'assets/sounds/punch.mp3';

  let hitAudio = new Audio();
  hitAudio.src = 'assets/sounds/hit.mp3';

  let breakAudio = new Audio();
  breakAudio.src = 'assets/sounds/break.mp3';
  
  let showWave = false;

  let inPlay = false;

  let showMessage = false;

  let indicators = [];
  let turrets = [];
  let creeps = [];
  let creepsToAdd = [];
  let lazers = [];
  let explosions = [];

  let selectedNewPiece;
  let selectedGamePiece;

  const initVars = (newGame=true) => {
    lastTimeStamp = performance.now();
    graphics.generateCells();

    cancelNextRequest = true;
    showGrid = true;
    showDescription = false;
    time = 0;
    selectedNewPiece = null;
    selectedGamePiece = null;
    inPlay = false;

    if(newGame) {
      turrets = [];
      creeps = [];
      lazers = [];
      level = 1;
      wave = 1;
      showWave = false;
      gold = 10;
      creepsToAdd = [];
      explosions = [];
    }

    messageText.updateText('Welcome, place your pieces')
    showMessage = true;

    getIndicators(level, wave);
  };

  let scoreText = pieces.text({
    text: `Score ${time}`,
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
  let waveText = pieces.text({
    text: `Wave ${wave}`,
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
  let messageText = pieces.text({
    text: 'message',
    font: `${20}px Arial`,
    fillStyle: " #cccccc",
    strokeStyle: " #cccccc",
    position: { x: 175, y: 620 },
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
    rotation: 0,
    imageSrc: "assets/buttons/start-button.png",
  });

  let sellButton = pieces.button({
    center: {
      x: 750,
      y: 100,
    },
    size: {
      x: 90,
      y: 40,
    },
    rotation: 0,
    imageSrc: "assets/buttons/sell-button.png",
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
    rotation: 0,
    level: 1,
    imageSrc: "assets/guns/ground-turret-1.png",
    type: 'ground',
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
    rotation: 0,
    imageSrc: "assets/guns/air-turret-1.png",
    type: 'air',
    level: 1,
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
    rotation: 0,
    radius: 100,
    imageSrc: "assets/guns/bomb-1.png",
    type: 'bomb',
    level: 1,
  });

  let description = pieces.button({
    center: { x: 700, y: 285 },
    size: {
      x: 110,
      y: 175,
    },
    rotation: 0,
    imageSrc: "assets/descriptions/ground-turret-1-description.png",
  });

  let upgradeButton = pieces.button({
    center: { x: 650, y: 400 },
    size: {
      x: 90,
      y: 40,
    },
    rotation: 0,
    imageSrc: "assets/buttons/upgrade-button.png",
  });
  let showGridButton = pieces.button({
    center: { x: 750, y: 400 },
    size: {
      x: 90,
      y: 40,
    },
    rotation: 0,
    imageSrc: "assets/buttons/show-grid.png",
  });

  // END OF STATE VARIABLES

  const addLazer = (from, goal) => {
    lazers.push(pieces.lazer({
      center: {...from.center},
      goal: {...goal.center},
      size: {
        x: 10,
        y: 10,
      },
      powerLevel: from.level,
      angle: utils.getAngle(from, goal),
      imageSrc: `assets/guns/bullet-${from.level}.png`,
    }))
    shotAudio.play();
  }

  const addCreep = (cell, type, dest) => {
    let newRenderer = renderer.AnimatedModel(
      {
        spriteSheet: `assets/creeps/${type}-west.png`,
        spriteCount: type === 'bird' ? 3 : 8,
        spriteTime: type === 'bird' ? [100, 100, 100] : [100, 100, 100, 100, 100, 100, 100, 100],
      },
      graphics
    );
    let newCreep = pieces.creep({
      center: {
          x: cell.center.x,
          y: cell.center.y,
      },
      size: {
          x: 50,
          y: 50,
      },
      rotation: 0,
      type: type,
      baseHealth: utils.getBaseHealth(level),
      damage: 0,
      renderer: newRenderer,
    })
    newCreep.setCells(graphics.cells)
    creeps.push(newCreep);
    newCreep.setBestPath(cell.loc, dest);
  }

  const updateCreepPaths = () => {
    for(let c of creeps) {
      c.setCells(graphics.cells);
      c.setBestPath(utils.findClosestCell(c.center, graphics.cells)?.loc, c.goal.loc)
    }
  }

  const handleUpgrade = utils.throttle(() => {
    punchAudio.play();
    if(selectedGamePiece) {
      if(gold - (selectedGamePiece.getPrice(selectedGamePiece.level + 1) - selectedGamePiece.getPrice()) >= 0){
        let oldPrice = selectedGamePiece.getPrice();
        selectedGamePiece.level += 1;
        let newPrice = selectedGamePiece.getPrice();
        gold -= newPrice - oldPrice;
        goldText.updateText(`Gold ${gold}`);
        let gunType = selectedGamePiece.type === 'bomb' ? selectedGamePiece.type : `${selectedGamePiece.type}-turret`
        selectedGamePiece.changeImage(`assets/guns/${gunType}-${selectedGamePiece.level}.png`)
        selectedGamePiece.radius = utils.updateRadius(selectedGamePiece.type, selectedGamePiece.level)
      }
    }
  }, 1000)

  const handleSell = utils.throttle(() => {
    if(selectedGamePiece !== null && !inPlay) {
      gold += selectedGamePiece.getPrice();
      goldText.updateText(`Gold ${gold}`);
      utils.remove(turrets, selectedGamePiece)
      breakAudio.play();
      updateCreepPaths();
      selectedGamePiece = null;
    }
  }, 1000)

  const handleMouse = (e) => {
    let loc = { x: e.offsetX, y: e.offsetY };

    if (utils.isInside(loc, upgradeButton)) {
      if(selectedGamePiece) {
        handleUpgrade();
      }
    }
    if (!selectedNewPiece) {
      if (utils.isInside(loc, startButton)) {
        handleStart();
      }
      if (utils.isInside(loc, sellButton)) {
        if (selectedGamePiece) {
          handleSell()
        }
      }
      if (utils.isInside(loc, showGridButton)) {
        showGrid = !showGrid;
      }
      if (utils.isInside(loc, airTurretIcon) && !inPlay) {
        selectedNewPiece = pieces.turret(utils.copyTurret(airTurretIcon));
        selectedGamePiece = null;
      } else if (utils.isInside(loc, groundTurretIcon) && !inPlay) {
        selectedNewPiece = pieces.turret(utils.copyTurret(groundTurretIcon));
        selectedGamePiece = null;
      } else if (utils.isInside(loc, bombIcon) && !inPlay) {
        selectedNewPiece = pieces.turret(utils.copyTurret(bombIcon));
        selectedGamePiece = null;
      }
    } else {
      if (utils.isInside(selectedNewPiece, graphics.gameGrid)) {
        let closest = utils.findClosestCell(
          selectedNewPiece.center,
          graphics.cells
        );
        let newPiece = { ...selectedNewPiece, center: closest.center };
        if(gold - newPiece.getPrice() >= 0 && !inPlay) {
          if(!utils.isBlocking(closest)) {
            turrets.push(newPiece);
            hitAudio.play();
            graphics.occupyCell(closest.loc.x, closest.loc.y, newPiece);
            gold -= newPiece.getPrice();
            goldText.updateText(`Gold ${gold}`);
          }
        } else {
          selectedNewPiece = null;
        }
      }
      selectedNewPiece = null;
    }

    if (!selectedGamePiece) {
      for (let t of turrets) {
        if (utils.isInside(loc, t)) {
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
      if (utils.isInside(loc, graphics.gameGrid)) {
        selectedNewPiece.setShowRadius(true);
      } else {
        selectedNewPiece.setShowRadius(false);
      }
    }
    if (selectedGamePiece) {
      if (utils.isInside(loc, graphics.gameGrid)) {
        selectedGamePiece.setShowRadius(true);
      } else {
        selectedGamePiece.setShowRadius(false);
      }
    }

    // TODO: make the menu portion change based off of upgrades
    if (!selectedNewPiece) {
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

  const handleExplosion = (turret) => {
    explosions.push({
      center: {...turret.center},
      radius: turret.radius,
      time: 2000,
      passedTime: 0,
      animationTime: 1000,
      animatedTime: 0,
      exploded: false,
      damage: turret.getBombDamage(),
      type: 'bomb'
    })
  }

  const getIndicators = (level, wave) => {
    let stats = utils.generateLevelStats(level, wave);
    indicators = [];
    for(let pos of stats.indicators) {
      indicators.push(pieces.text({
        text: '*',
        font: `${30}px Courier, monospace`,
        fillStyle: " #cccccc",
        strokeStyle: " #cccccc",
        position: {...pos},
      }));
    }
  }

  mouse.register("mousedown", handleMouse);

  mouse.register("mousemove", handleMouseMove);

  const handleStart = utils.throttle(() => {
    if(!inPlay) {
      showMessage = false;
      console.log('startttt')
      inPlay = true;
  
      let stats = utils.generateLevelStats(level, wave);
      getIndicators(level, wave)
      creepsToAdd = stats.creepStats;
      console.log(creeps);
  
      showWave = true;
    }

  }, 1000)


  function processInput(elapsedTime) {
    keyboard.update(elapsedTime);
    mouse.update(elapsedTime);
  }

  // let testTime = 0;

  let lastAdded = 0;
  let lastAddedWait = 0;
  function update(elapsedTime) {
    // testTime += elapsedTime

    // if(testTime > 2000 && turrets.length > 0 && creeps.length > 0) {
    //   for(let t of turrets) {
    //     addLazer(t, creeps[0], 1)
    //   }
    //   testTime = 0;
    // } else if(creeps.length < 3) {
    //   setTimeout(() => {
    //     addCreep(graphics.cells[0][5], 'knight', graphics.cells[11][5].loc)
    //   }, 1000)
    //   addCreep(graphics.cells[0][5], 'knight', graphics.cells[11][5].loc)
    // }


    // update
    updateKeys();

    for(let e of explosions) {
      e.passedTime += elapsedTime;
      if(e.passedTime > e.time && !e.exploded) {
        e.exploded = true;
        deathAudio.play();
        for(let c of creeps) {
          if(utils.typeMatches({type: 'bomb'}, c) && utils.insideRadius({center: e.center}, e.radius, c)) {
            punchAudio.play();
            c.handleHit(e.damage);
          }
        }
      }
    }

    if(creepsToAdd.length === 0 && creeps.length === 0 && inPlay) {
      console.log('WAVE OVER')
      if(wave == 2 && level !== 3) { 
        level += 1
        score += 100;
        wave = 1;
      } else {
        wave += 1
      }
      inPlay = false;
      indicators = [];
      if(!(level === 3 && wave === 3)) {
        getIndicators(level, wave)
        waveText.updateText(`Wave ${wave}`)
        levelText.updateText(`Level ${level}`)
        showMessage = true;
        messageText.updateText('Prepare for next wave');
        setTimeout(() => {
          handleStart();
          messageText.updateText('Wave starting')
          setTimeout(() => {
            showMessage = false;
          }, 1000)
        }, 8 * 1000)
      } else {
        showMessage = true;
        messageText.updateText('Congragulations! navigate to main menu')
        let scores = localStorage.getItem("scores") || "[]";
        scores = JSON.parse(scores);
        scores.push(score);
        scores.sort(function (a, b) {
          return a - b;
        });
        if (scores.length > 5) {
          scores.shift();
        }
        localStorage.setItem("scores", JSON.stringify(scores));
      }
    }

    lastAdded += elapsedTime;
    if(lastAdded >= lastAddedWait && creepsToAdd.length > 0) {
      let creepToAdd = creepsToAdd.pop();
      addCreep(
        graphics.cells[creepToAdd.start.x][creepToAdd.start.y],
        creepToAdd.type,
        creepToAdd.goal
        )
        lastAdded = 0;
        lastAddedWait = Random.nextRange(1500, 3000);
    }

    for(let l of lazers) {
      l.updateMovement(elapsedTime)
    }
    for(let c of creeps) {
      if(c.health === 0) {
        utils.remove(creeps, c);
        gold += 1;
        score += 25;
        goldText.updateText(`Gold ${gold}`)
        scoreText.updateText(`Score ${score}`);
      } else {
        c.renderer.update(elapsedTime);
        c.move(elapsedTime);
        if(c.center.x === c.goal.center.x && c.center.y === c.goal.center.y) {
          utils.remove(creeps, c);
          deathAudio.play();
          score -= 50;
          scoreText.updateText(`Score ${score}`);
        }
      }
    }

    for(let t of turrets) {
      if(inPlay) {
        t.coolDownTime += elapsedTime;
        for(let c of creeps) {
          if(utils.insideRadius(t, t.radius, c)) {
            if(t.requiredCoolDown < t.coolDownTime) {
              if(t.type === 'bomb') {
                utils.remove(turrets, t);
                if(utils.typeMatches(t, c)) {
                  handleExplosion(t);
                }
                break;
              }
              else if(utils.typeMatches(t, c)) {
                t.rotation = utils.getAngle(t, c);
                t.coolDownTime = 0;
                addLazer(t, c)
                break;
              }
            }
          }
        }
      }
    }

    for(let l of lazers) {
      for(let c of creeps) {
        if(utils.isIntersecting(l, c)) {
          punchAudio.play();
          c.handleHit(l.damage)
          utils.remove(lazers, l);
        }
      }
    }
  }

  function render(elapsedTime) {
    graphics.clear();

    if (selectedNewPiece?.showRadius) {
      graphics.drawCircle(selectedNewPiece, "#6699CC");
    }
    if (selectedGamePiece?.showRadius) {
      graphics.drawCircle(selectedGamePiece, "#6699CC");
    }

    if (showGrid) {
      graphics.drawGrid();
    }
    graphics.drawBorder();

    renderer.Model.render(groundTurretIcon);
    renderer.Model.render(airTurretIcon);
    renderer.Model.render(bombIcon);

    if (showDescription) {
      renderer.Model.render(description);
    }

    renderer.Text.render(scoreText);
    renderer.Text.render(levelText);
    if(showWave) {
      renderer.Text.render(waveText);
    }
    if(showMessage) {
      renderer.Text.render(messageText);
    }
    renderer.Text.render(goldText);

    renderer.Model.render(startButton);
    renderer.Model.render(sellButton);
    renderer.Model.render(upgradeButton);
    renderer.Model.render(showGridButton);

    for(let i of indicators) {
      renderer.Text.render(i);
    }

    if (selectedNewPiece) {
      renderer.Model.render(selectedNewPiece);
    }

    for(let l of lazers) {
      renderer.Model.render(l);
      if(!utils.isInside(l, graphics.gameGrid)){
        utils.remove(lazers, l);
      }
    }
    
    for (let turret of turrets) {
      renderer.Model.render(turret);
    }

    for (let creep of creeps) {
      graphics.drawRectangle(creep.healthRects.red, "red", "red");
      graphics.drawRectangle(creep.healthRects.green, "green", "green");
      creep.renderer.render(creep);
    }

    for(let e of explosions) {
      if(e.exploded) {
        e.animatedTime += elapsedTime;
        if(e.animationTime < e.animatedTime) {
          utils.remove(explosions, e);
        } else {
          graphics.drawCircle({center: e.center, radius: e.radius}, 'red')
        }
      }
    }
  }

  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;

    processInput(elapsedTime);
    update(elapsedTime);
    lastTimeStamp = time;

    render(elapsedTime);

    requestAnimationFrame(gameLoop);
  }

  const updateKeys = () => {
    keyboard.register(
      window.localStorage.getItem("sell") || "s",
      handleSell
    );
    keyboard.register(
      window.localStorage.getItem("start") || "g",
      handleStart
    );
    keyboard.register(
      window.localStorage.getItem("upgrade") || "u",
      handleUpgrade
    );
  };

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
