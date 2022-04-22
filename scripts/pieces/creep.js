MyGame.pieces.creep = function (spec) {
  "use strict";

  let myCells = [];

  const setCenter = (loc) => {
    spec.center = loc;
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
      myCells.push(newRow)
    }
  };

  const getAdjacentCells = (cell) => {
    let neighbors = [];
    if (cell.loc.y - 1 >=0 && myCells[cell.loc.x][cell.loc.y - 1].piece === null) {
      neighbors.push(myCells[cell.loc.x][cell.loc.y - 1]);
    }
    if (cell.loc.x + 1 < myCells.length && myCells[cell.loc.x + 1][cell.loc.y].piece === null) {
      neighbors.push(myCells[cell.loc.x + 1][cell.loc.y]);
    }
    if (cell.loc.y + 1 < myCells.length && myCells[cell.loc.x][cell.loc.y + 1].piece === null) {
      neighbors.push(myCells[cell.loc.x][cell.loc.y + 1]);
    }
    if (cell.loc.x - 1 >= 0 && myCells[cell.loc.x - 1][cell.loc.y].piece === null) {
      neighbors.push(myCells[cell.loc.x - 1][cell.loc.y]);
    }
    return neighbors;
  };

  const gatherPaths = (start, end) => {
      let startCell = myCells[start.x][start.y]
      let endCell = myCells[end.x][end.y]

      let queue = [];
      startCell.distance = 0;
      queue.push(startCell);

      let solution = null;

      while(queue.length > 0) {
          let currentLocation = queue.shift();
          if(currentLocation === endCell) {
              solution = currentLocation;
              return currentLocation;
          }
          currentLocation.visited = true;
          currentLocation.distance =  currentLocation.parent ? currentLocation.parent.distance + 1 : 1
          for(let a of getAdjacentCells(currentLocation)) {
              if(!a.visited) {
                  queue.push(a);
                  a.parent = currentLocation;
              }
          }
      }
      return solution
  }

  const getBestPath = (start, end) => {
    let endNode = gatherPaths(start, end)
    let parent = endNode
    let path = [];
    while(parent) {
        path.push(parent);
        parent = parent.parent
    }
    return path
  }

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
    setCenter,
    getBestPath,
    setCells
  };
};
