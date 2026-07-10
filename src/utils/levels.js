const DEFAULT_VIEWER_LEVELS = [
  { name: 'Bronce', points: 0 },
  { name: 'Plata', points: 100 },
  { name: 'Oro', points: 300 },
  { name: 'Platino', points: 700 },
  { name: 'Diamante', points: 1500 },
  { name: 'Maestro', points: 3000 }
];

function computeViewerLevel(points) {
  let current = DEFAULT_VIEWER_LEVELS[0].name;
  for (const level of DEFAULT_VIEWER_LEVELS) {
    if (points >= level.points) {
      current = level.name;
    }
  }
  return current;
}

module.exports = {
  DEFAULT_VIEWER_LEVELS,
  computeViewerLevel
};
