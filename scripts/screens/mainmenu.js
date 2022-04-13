MyGame.screens["main-menu"] = (function (router) {
    "use strict";
  
    function initialize() {
      document.getElementById("to-about").addEventListener("click", () => {
        router.showScreen("about");
      });
      document.getElementById("to-hs").addEventListener("click", () => {
        router.showScreen("high-scores");
      });
      document.getElementById('to-game').addEventListener("click", () => {
          router.showScreen("gameplay");
      })
      document.getElementById("to-controls").addEventListener("click", () => {
        router.showScreen("controls");
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
  