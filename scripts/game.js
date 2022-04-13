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
  router
) {
  "use strict";

  let lastTimeStamp = performance.now();
  let cancelNextRequest = true;

  let particlesFire = systems.ParticleSystem(
    {
      center: { x: 300, y: 300 },
      size: { mean: 10, stdev: 4 },
      speed: { mean: 50, stdev: 25 },
      lifetime: { mean: 4, stdev: 1 },
    },
    graphics
  );
  let particlesSmoke = systems.ParticleSystem(
    {
      center: { x: 300, y: 300 },
      size: { mean: 10, stdev: 4 },
      speed: { mean: 50, stdev: 25 },
      lifetime: { mean: 4, stdev: 1 },
    },
    graphics
  );
  let renderFire = renderer.ParticleSystem(
    particlesFire,
    graphics,
    assets["fire"]
  );
  let renderSmoke = renderer.ParticleSystem(
    particlesSmoke,
    graphics,
    assets["smoke"]
  );

  function update(elapsedTime) {
    particlesSmoke.update(elapsedTime);
    particlesFire.update(elapsedTime);
  }

  function render() {
    graphics.clear();

    renderSmoke.render();
    renderFire.render();
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
    requestAnimationFrame(gameLoop);
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
