MyGame.graphics = (function () {
  "use strict";

  let canvas = document.getElementById("id-canvas");
  let context = canvas.getContext("2d");

  let gameGrid = {
    // this is the top left of the rect
    location: { x: 50, y: 50 },
    center: { x: 50 + 540 / 2, y: 50 + 540 / 2 },
    size: {
      x: 540,
      y: 540,
    },
    cellWidth: 540 / 12,
    fillStyle: "#FF0000",
  };

  //------------------------------------------------------------------
  //
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --------------------------------------------------------------
  //
  // Draws a texture to the canvas with the following specification:
  //    image: Image
  //    center: {x: , y: }
  //    size: { width: , height: }
  //
  // --------------------------------------------------------------
  function drawTexture(image, center, rotation, size) {
    context.save();

    context.translate(center.x, center.y);
    context.rotate(rotation);
    context.translate(-center.x, -center.y);

    context.drawImage(
      image,
      center.x - size.x / 2,
      center.y - size.y / 2,
      size.x,
      size.y
    );

    context.restore();
  }

  // --------------------------------------------------------------
  //
  // Draw a rectangle to the canvas with the following attributes:
  //      center: { x: , y: },
  //      size: { x: , y: },
  //      rotation:       // radians
  //
  // --------------------------------------------------------------
  function drawRectangle(rect, fillStyle, strokeStyle) {
    context.save();
    context.translate(rect.center.x, rect.center.y);
    context.rotate(rect.rotation);
    context.translate(-rect.center.x, -rect.center.y);

    context.fillStyle = fillStyle;
    context.fillRect(
      rect.center.x - rect.size.x / 2,
      rect.center.y - rect.size.y / 2,
      rect.size.x,
      rect.size.y
    );

    context.strokeStyle = strokeStyle;
    context.strokeRect(
      rect.center.x - rect.size.x / 2,
      rect.center.y - rect.size.y / 2,
      rect.size.x,
      rect.size.y
    );

    context.restore();
  }

  function drawText(spec) {
    context.save();

    context.lineWidth = 1;

    context.font = spec.font;
    context.fillStyle = spec.fillStyle;
    context.strokeStyle = spec.strokeStyle;
    context.textBaseline = "top";

    context.translate(spec.position.x, spec.position.y);
    context.rotate(spec.rotation);
    context.translate(-spec.position.x, -spec.position.y);

    context.fillText(spec.text, spec.position.x, spec.position.y);
    context.strokeText(spec.text, spec.position.x, spec.position.y);

    context.restore();
  }

  function drawSubTexture(
    image,
    index,
    subTextureWidth,
    center,
    rotation,
    size
  ) {
    context.save();

    context.translate(center.x, center.y);
    context.rotate(rotation);
    context.translate(-center.x, -center.y);

    //
    // Pick the selected sprite from the sprite sheet to render
    context.drawImage(
      image,
      subTextureWidth * index,
      0, // Which sub-texture to pick out
      subTextureWidth,
      image.height, // The size of the sub-texture
      center.x - size.x / 2, // Where to draw the sub-texture
      center.y - size.y / 2,
      size.x,
      size.y
    );

    context.restore();
  }

  const drawGrid = () => {
    context.beginPath();
    for (
      var x = gameGrid.location.x;
      x < gameGrid.size.x + gameGrid.cellWidth * 2;
      x += gameGrid.cellWidth
    ) {
      context.moveTo(0.5 + x, gameGrid.location.y);
      context.lineTo(0.5 + x, gameGrid.location.y + gameGrid.size.y);
    }
    for (
      var y = gameGrid.location.y;
      y < gameGrid.size.y + gameGrid.cellWidth * 2;
      y += gameGrid.cellWidth
    ) {
      context.moveTo(gameGrid.location.x, 0.5 + y);
      context.lineTo(gameGrid.location.x + gameGrid.size.x, 0.5 + y);
    }
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = "white";
    context.stroke();
  };

  const drawBorder = () => {
    context.beginPath();

    // left side
    context.moveTo(0.5 + gameGrid.location.x, gameGrid.location.y);
    context.lineTo(
      0.5 + gameGrid.location.x,
      gameGrid.location.y + gameGrid.cellWidth * 4
    );

    context.moveTo(
      0.5 + gameGrid.location.x,
      gameGrid.location.y + gameGrid.cellWidth * 8
    );
    context.lineTo(
      0.5 + gameGrid.location.x,
      gameGrid.location.y + gameGrid.cellWidth * 12
    );

    // right side
    context.moveTo(
      0.5 + gameGrid.location.x + gameGrid.size.x,
      gameGrid.location.y
    );
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.size.x,
      gameGrid.location.y + gameGrid.cellWidth * 4
    );

    context.moveTo(
      0.5 + gameGrid.location.x + gameGrid.size.x,
      gameGrid.location.y + gameGrid.cellWidth * 8
    );
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.size.x,
      gameGrid.location.y + gameGrid.cellWidth * 12
    );

    // top
    context.moveTo(0.5 + gameGrid.location.x, gameGrid.location.y);
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 4,
      gameGrid.location.y
    );

    context.moveTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 8,
      gameGrid.location.y
    );
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 12,
      gameGrid.location.y
    );

    // bottom
    context.moveTo(
      0.5 + gameGrid.location.x,
      gameGrid.location.y + gameGrid.size.y
    );
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 4,
      gameGrid.location.y + gameGrid.size.y
    );

    context.moveTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 8,
      gameGrid.location.y + gameGrid.size.y
    );
    context.lineTo(
      0.5 + gameGrid.location.x + gameGrid.cellWidth * 12,
      gameGrid.location.y + gameGrid.size.y
    );

    context.closePath();
    context.lineWidth = 4;
    context.strokeStyle = "blue";
    context.stroke();
  };

  let api = {
    clear: clear,
    drawTexture: drawTexture,
    drawRectangle: drawRectangle,
    drawText: drawText,
    drawGrid: drawGrid,
    drawBorder: drawBorder,
    drawSubTexture: drawSubTexture,
    canvas,
    context,
    gameGrid,
  };

  return api;
})();
