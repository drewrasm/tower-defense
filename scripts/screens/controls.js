MyGame.screens["controls"] = (function (router) {
    "use strict";
  
    let selectedControl = null;
  
    let keyListener = null;

    // NOTE: These controls aren't necessarily the ones you'll always use... 
  
    let controls = {
      down: {
        element: document.getElementById("control-down"),
        value: "ArrowDown",
      },
      up: {
        element: document.getElementById("control-up"),
        value: "ArrowUp",
      },
      right: {
        element: document.getElementById("control-right"),
        value: "ArrowRight",
      },
      left: {
        element: document.getElementById("control-left"),
        value: "ArrowLeft",
      },
      fire: {
        element: document.getElementById("control-fire"),
        value: " ",
      },
    };
  
    function initialize() {
      //
    }
  
    const styleSelected = (selected) => {
      for (let control of Object.keys(controls)) {
        if (control === selected) {
          controls[control].element.classList.add("selected");
        } else {
          controls[control].element.classList.remove("selected");
        }
      }
    };
  
    const setControlHtml = (control, value) => {
      if(value == " ") {
        value = 'space'
      }
      controls[control].element.innerHTML = value;
    };
  
    const codeInUse = (code) => {
      for (let control of Object.keys(controls)) {
        if (controls[control].value === code) {
          return true;
        }
      }
      return false;
    };
  
    const storeControl = (control, value) => {
      localStorage.setItem(control, value);
    };
  
    function run() {
      document
        .getElementById("controls-to-main")
        .addEventListener("click", () => {
          router.showScreen("main-menu");
          document.removeEventListener("keydown", keyListener);
          selectedControl = null;
          styleSelected("");
        });
  
      for (let control of Object.keys(controls)) {
        let storedControl = localStorage.getItem(control);
        if (storedControl !== null) {
          controls[control].value = storedControl;
        }
        setControlHtml(control, controls[control].value);
        controls[control].element.parentNode.addEventListener("click", () => {
          selectedControl = control;
          styleSelected(control);
        });
      }
  
      keyListener = document.addEventListener("keydown", (e) => {
        if (selectedControl !== null && !codeInUse(e.code)) {
          controls[selectedControl].value = e.code;
          setControlHtml(selectedControl, e.code);
          storeControl(selectedControl, e.key);
        }
      });
    }
  
    return {
      initialize: initialize,
      run: run,
    };
  })(MyGame.router);
  