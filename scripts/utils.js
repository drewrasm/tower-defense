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

  const insideRadius = (loc, radius, obj) => {
    let circleDistX = Math.abs(loc.center.x - obj.center.x);
    let circleDistY = Math.abs(loc.center.y - obj.center.y);

    if(circleDistX > ((obj.size.x/2) + radius)){
      return false
    }
    if(circleDistY > ((obj.size.y / 2) + radius)) {
      return false
    }

    if(circleDistX <= (obj.size.x / 2)) {
      return true
    }
    if(circleDistY <= (obj.size.y / 2)) {
      return true
    }

    let corenerDist = Math.pow((circleDistX - (obj.size.x / 2)), 2) + Math.pow((circleDistY - (obj.size.y / 2)), 2)

    return corenerDist <= (Math.pow(radius, 2));
  }

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
      type: turret.type,
      level: turret.level,
      coolDownTime: 0
    };
  };

  const levels = {
    1: {
      1: {
        knight: 5,
        turtle: 5,
        bird: 0,
      },
      2: {
        knight: 7,
        turtle: 7,
        bird: 0,
      },
    },
    2: {
      1: {
        knight: 8,
        turtle: 8,
        bird: 0,
      },
      2: {
        knight: 10,
        turtle: 10,
        bird: 1,
      },
    },
    3: {
      knight: 10,
      turtle: 10,
      bird: 5,
    },
  };
  

  const indicatorLocs = {
    1: [
      { x: 15, y: 315 }
    ],
    2: [{ x: 325, y: 15 }],
  }

  const startPoints = {
    1: {
      start: {
        minX: 0,
        maxX: 0,
        minY: 4,
        maxY: 7
      },
      goal: {
        minX: 11,
        maxX: 11,
        minY: 4,
        maxY: 7,
      }
    },
    2: {
      start: {
        minX: 4,
        maxX: 7,
        minY: 0,
        maxY:0,
      },
      goal: {
        minX: 4,
        maxX: 7,
        minY: 11,
        maxY: 11,
      }
    }
  }

  const shuffleList = (list) => {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  const generateLevelStats = (level, wave) => {
    let types = ['bird', 'knight', 'turtle']
    let stats = {
      creepStats: []
    }
    let creepNums = levels[level][wave];
    for(let type of types) {
      for(let i = 0; i< creepNums[type]; i++) {
        stats.creepStats.push({
            start: {
              x: Random.nextRange(startPoints[level].start.minX, startPoints[level].start.maxX),
              y: Random.nextRange(startPoints[level].start.minY, startPoints[level].start.maxY)
            },
            goal: {
              x: Random.nextRange(startPoints[level].goal.minX, startPoints[level].goal.maxX),
              y: Random.nextRange(startPoints[level].goal.minY, startPoints[level].goal.maxY)
            },
            type: type
        })
      }
    }
    stats.creepStats = shuffleList(stats.creepStats);
    stats.indicators = level < 3 ? indicatorLocs[level] : [indicatorLocs[1][0], indicatorLocs[0][0]];
    return stats;
  }

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

  const levelsToHealth = {
    1: 20,
    2: 30,
    3: 40,
    3: 45,
  }

  function throttle(fn, limit) {
    let waiting = false;
    return (...args) => {
      if (!waiting) {
        fn.apply(this, args);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  }

  const getBaseHealth = (level=1) => {
    return levelsToHealth[level]
  }

  const typeMatches = (turret, creep) => {
    if(turret.type === 'air' && creep.type === 'bird') {
      return true;
    }
    if(turret.type === 'ground' && creep.type !== 'bird') {
      return true;
    }
    if(turret.type === 'bomb' && creep.type !== 'bird') {
      return true;
    }
    return turret.type === 'both';
  }

  let api = {
    remove,
    isInside,
    insideRadius,
    isIntersecting,
    copyTurret,
    findClosestCell,
    getAngle,
    getClosest,
    getBaseHealth,
    throttle,
    generateLevelStats,
    typeMatches,
    levels,
  };

  return api;
})();
