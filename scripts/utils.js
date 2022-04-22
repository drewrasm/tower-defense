MyGame.utils = (function () {
  "use strict";

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
      roation: turret.roation,
      imageSrc: turret.imageSrc,
      radius: turret.radius
    }
  }
  
  const turretTypes = {
    
  }

  const findClosestCell = (loc, cells) => {
    let closest = cells[0][0];
    for(let row of cells) {
      for(let cell of row) {
        let currentDiff = Math.abs(cell.center.x - loc.x) + Math.abs(cell.center.y - loc.y);
        let closestDiff = Math.abs(closest.center.x - loc.x) + Math.abs(closest.center.y - loc.y);
        if(currentDiff < closestDiff) {
          closest = cell;
        }
      }
    }
    return closest

  }

  let api = {
    isInside,
    isIntersecting,
    copyTurret,
    findClosestCell
  };


  return api;
})();
