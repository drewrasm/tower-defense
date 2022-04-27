MyGame.pieces.creep = function (spec) {
  "use strict";

  let animationTime = 250;
  let animationSegments = 10;

  let moveTime = 0;

  let myCells = [];

  let path = [];
  let currentCell = null;

  let goal = null;

  const move = (elapsedTime) => {
    moveTime += elapsedTime; 

    if(moveTime >= animationTime) {
      handleMove();
      moveTime = 0;
    }
  }

  const handleMove = () => {
    // depending on the goal cell and the current direction
    // once the increment is over and you've gotten to the cell, pop off the new cell to go to
    if(currentCell === null && path.length > 0) {
      currentCell = path.pop();
      changeDirection(currentCell)
      moveSegment();
    } else if(currentCell !== null) {
      moveSegment();
      if(spec.center.x === currentCell.center.x && spec.center.y === currentCell.center.y) {
        currentCell = null;
      }
    }
  }

  const moveSegment = () => {
      if(spec.direction === 'east') {
        spec.center.x += (spec.size.x / animationSegments)
      }
      if(spec.direction === 'west') {
        spec.center.x -= (spec.size.x / animationSegments)
      }
      if(spec.direction === 'north') {
        spec.center.y -= (spec.size.y / animationSegments)
      }
      if(spec.direction === 'south') {
        spec.center.y += (spec.size.y / animationSegments)
      }
  }

  const changeDirection = (cell) => {
    if(spec.center.x < cell.center.x) {
      spec.direction = 'east'
      changeRendererImage();
    }
    else if(spec.center.x > cell.center.x) {
      spec.direction = 'west'
      changeRendererImage();
    }
    else if(spec.center.y < cell.center.y) {
      spec.direction = 'south'
      changeRendererImage();
    }
    else if(spec.center.y > cell.center.y) {
      spec.direction = 'north'
      changeRendererImage();
    }
  }


  const changeRendererImage = () => {
    spec.renderer.changeImage(`assets/creeps/${spec.type}-${spec.direction}.png`);
  }
  

  const getHealth = () => {
    return spec.baseHealth - spec.damage > 0
      ? spec.baseHealth - spec.damage
      : 0;
  };

  const getHealthRects = () => {
    let rectCenterY = spec.center.y - spec.size.y / 2 - 2;
    let rectSizeX = spec.size.x * 0.8;
    let rectSizeY = 2;
    let percentage = getHealth() / spec.baseHealth;
    return {
      red: {
        size: { x: rectSizeX, y: rectSizeY },
        center: { x: spec.center.x, y: rectCenterY },
      },
      green: {
        size: { x: rectSizeX * percentage, y: rectSizeY },
        center: {
          x: spec.center.x - rectSizeX / 2 + (rectSizeX * percentage) / 2,
          y: rectCenterY,
        },
      },
    };
  };

  const setCenter = (loc) => {
    spec.center = loc;
  };

  const handleHit = (currentDamage) => {
    spec.damage += currentDamage;
  };

  const setCells = (cells) => {
    myCells = [];
    for (let row of cells) {
      let newRow = [];
      for (let cell of row) {
        newRow.push({
          center: {
            x: cell.center.x,
            y: cell.center.y,
          },
          loc: {
            x: cell.loc.x,
            y: cell.loc.y,
          },
          piece: cell.piece,
          cost: null,
        });
      }
      myCells.push(newRow);
    }
  };

  const getAdjacentCells = (cell) => {
    let neighbors = [];
    if (
      cell.loc.y - 1 >= 0 &&
      (myCells[cell.loc.x][cell.loc.y - 1].piece === null || spec.type === 'bird')
    ) {
      neighbors.push(myCells[cell.loc.x][cell.loc.y - 1]);
    }
    if (
      cell.loc.x + 1 < myCells.length &&
      (myCells[cell.loc.x + 1][cell.loc.y].piece === null || spec.type === 'bird')
    ) {
      neighbors.push(myCells[cell.loc.x + 1][cell.loc.y]);
    }
    if (
      cell.loc.y + 1 < myCells.length &&
      (myCells[cell.loc.x][cell.loc.y + 1].piece === null || spec.type === 'bird')
    ) {
      neighbors.push(myCells[cell.loc.x][cell.loc.y + 1]);
    }
    if (
      cell.loc.x - 1 >= 0 &&
    (myCells[cell.loc.x - 1][cell.loc.y].piece === null || spec.type === 'bird')
    ) {
      neighbors.push(myCells[cell.loc.x - 1][cell.loc.y]);
    }
    return neighbors;
  };

  const gatherPaths = (start, end) => {
    let startCell = myCells[start.x][start.y];
    let endCell = myCells[end.x][end.y];

    let queue = [];
    startCell.distance = 0;
    queue.push(startCell);

    let solution = null;

    while (queue.length > 0) {
      let currentLocation = queue.shift();
      if (currentLocation === endCell) {
        solution = currentLocation;
        return currentLocation;
      }
      currentLocation.visited = true;
      currentLocation.distance = currentLocation.parent
        ? currentLocation.parent.distance + 1
        : 1;
      for (let a of getAdjacentCells(currentLocation)) {
        if (!a.visited) {
          queue.push(a);
          a.parent = currentLocation;
        }
      }
    }
    return solution;
  };

  const setBestPath = (start, end) => {
    let oldPath = path;
    let newPath = [];
    let endNode = gatherPaths(start, end);
    let parent = endNode;
    newPath = [];
    while (parent) {
      newPath.push(parent);
      parent = parent.parent;
    }
    if(oldPath.length === newPath.length) {
      isDifferent = false;
      for(let i=0; i<path.length; i++) {
        if(newPath[i] !== oldPath[i]) {
          isDifferent = true;
        } else {
          isDifferent = true;
        }
      }
      if(!isDifferent) {
        return oldPath
      }
    }
    path = newPath
    goal = path.length > 1 ? path[0] : null;
    return newPath;
  };

  return {
    get x() {
      return spec.center.x;
    },
    get y() {
      return spec.center.y;
    },
    get center() {
      return spec.center;
    },
    get size() {
      return spec.size;
    },
    get type() {
      return spec.type;
    },
    get health() {
      return getHealth();
    },
    get baseHealth() {
      return spec.baseHealth;
    },
    get healthRects() {
      return getHealthRects();
    },
    get renderer() {
      return spec.renderer;
    },
    get path() {
      return path;
    },
    get goal() {
      return goal;
    },
    handleHit,
    setCenter,
    setBestPath,
    setCells,
    move,
  };
};
