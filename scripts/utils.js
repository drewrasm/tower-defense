MyGame.utils = (function () {
  "use strict";


  const remove = (list, item) => {
    list.splice(list.indexOf(item), 1)
  }

  const isIntersecting = (first, second) => {
    return (
      !(
        first.center.y - first.size.y / 2 >
          second.center.y + second.size.y / 2 ||
        first.center.y + first.size.y / 2 < second.center.y - second.size.y / 2
      ) &&
      !(
        first.center.x + first.size.x / 2 <
          second.center.x - second.size.x / 2 ||
        first.center.x - first.size.x / 2 > second.center.x + second.size.x / 2
      )
    );
  };

  const isInside = (loc, obj) => {
    return (
      loc.x >= obj.center.x - obj.size.x / 2 &&
      loc.x <= obj.center.x + obj.size.x / 2 &&
      loc.y >= obj.center.y - obj.size.y / 2 &&
      loc.y <= obj.center.y + obj.size.y / 2
    );
  };

  const getAngle = (a, b) => {
    let dy = a.center.y - b.center.y;
    let dx = a.center.x - b.center.x;
    return Math.atan2(dy, dx);
  };

  const getSlope = (a, b) => {
    let dy = a.center.y - b.center.y;
    let dx = a.center.x - b.center.x;
    return dy/dx;
  }

  const copyTurret = (turret) => {
    return {
      center: {
        x: turret.center.x,
        y: turret.center.y,
      },
      size: {
        x: turret.size.x,
        y: turret.size.y,
      },
      rotation: 0,
      imageSrc: turret.imageSrc,
      radius: turret.radius,
    };
  };

  const levels = {
    1: {
      1: {
        knight: 5,
        turtle: 5,
        birds: 0,
      },
      2: {
        knight: 7,
        turtle: 7,
        birds: 0,
      },
    },
    2: {
      1: {
        knight: 8,
        turtle: 8,
        birds: 0,
      },
      2: {
        knight: 10,
        turtle: 10,
        birds: 1,
      },
    },
    3: {
      knight: 10,
      turtle: 10,
      birds: 5,
    },
  };

  const getDistance = (a, b) => {
    return (Math.abs(a.center.x - b.center.x) + Math.abs(a.center.y - b.center.y));
  }

  const getClosest = (obj, targets) => {
    let closest = null;
    for(let t of targets) {
      if(closest) {
        if(getDistance(t, obj) < getDistance(closest, obj)) {
          closest = t;
        }
      } else {
        closest = t;
      }
    }
    return closest
  }

  const findClosestCell = (loc, cells) => {
    let closest = cells[0][0];
    for (let row of cells) {
      for (let cell of row) {
        let currentDiff =
          Math.abs(cell.center.x - loc.x) + Math.abs(cell.center.y - loc.y);
        let closestDiff =
          Math.abs(closest.center.x - loc.x) +
          Math.abs(closest.center.y - loc.y);
        if (currentDiff < closestDiff) {
          closest = cell;
        }
      }
    }
    return closest;
  };

  let api = {
    remove,
    isInside,
    isIntersecting,
    copyTurret,
    findClosestCell,
    getAngle,
    getClosest,
    levels,
  };

  return api;
})();
