MyGame.screens["about"] = (function (router) {
  "use strict";

  function initialize() {
    document.getElementById("about-to-main").addEventListener("click", () => {
      router.showScreen("main-menu");
    });
  }

  function run() {
    // nothing to run
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.router);
