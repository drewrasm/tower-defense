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
  let api = {
    isInside,
    isIntersecting,
  };

  return api;
})();
