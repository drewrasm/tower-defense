MyGame.pieces.creep = function (spec) {
  "use strict";

  let myCells = [];

  const setCenter = (loc) => {
    spec.center = loc;
  };

  // HOW WE ARE GONNA DO THIS PATH THING:
  // we need a type of copy of the current state of the grid
  // this is fine because when you press start, the grid won't change
  // we need to assign a cost to each cell of the grid
  // get the lowest cost and find the best path

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



  // MAY BE USEFUL LATER
  //   const gatherCosts = (cell, visited) => {
//     let adjacents = getAdjacentCells(cell);
//     for (let a of adjacents) {
//       if (!visited.includes(a)) {
//         if(a.cost === null){
//             a.cost = cell.cost + 1;
//             console.log(`setting x:${a.loc.x}, y:${a.loc.y} to ${a.cost}`)
//             console.log(visited.length)
//             visited.push(a);
//             gatherCosts(a, visited);
//         }
//       }
//     }
//   };

//   const getShortestCostNeighbor = (cell) => {
//     let neighbors = getAdjacentCells(cell);
//     let min = neighbors[0];
//     for (let n of neighbors) {
//       if (n.cost < min.cost) {
//         min = n;
//       }
//     }
//     return min;
//   };

//   // SOMETHING IS WRONG
//   const getBestPath = (start, goal) => {
//     let path = [];
//     myCells[start.x][start.y].cost = 0;
//     gatherCosts(myCells[start.x][start.y], [myCells[start.x][start.y]]);
//     debugger
//     let current = myCells[goal.x][goal.y];
//     while (current != myCells[start.x][start.y]) {
//       let shortest = getShortestCostNeighbor(current);
//       path.push(shortest);
//       current = shortest;
//     }
//     return path;
//   };

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
