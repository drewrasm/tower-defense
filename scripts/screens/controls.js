MyGame.screens["controls"] = (function (router) {
    "use strict";
  
    let selectedControl = null;
  
    let keyListener = null;

    let controls = {
      upgrade: {
        element: document.getElementById("control-upgrade"),
        value: "KeyU",
      },
      sell: {
        element: document.getElementById("control-sell"),
        value: "KeyS",
      },
      start: {
        element: document.getElementById("control-start"),
        value: "KeyG",
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
  