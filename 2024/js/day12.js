const fs = require("fs");

const DIAGONAL_NODE_TRANSFORMATIONS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
];


let input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`.trim();
// input = `
// AAAAAA
// AAABBA
// AAABBA
// ABBAAA
// ABBAAA
// AAAAAA`.trim();
input = fs.readFileSync('./tests/test_day12.txt', 'utf8').trim();

const matrix = input.split("\n").map((line) => line.split(""));

// walk the matrix and extract coordinates of each region
const visited = [];
const regions = [];
matrix.forEach((line, lineIndex) => {
  line.forEach((_char, charIndex) => {
    const coordinate = [lineIndex, charIndex];
    // skip previouosly visited coordinates
    if (includesCoordinate(visited, coordinate)) {
      return;
    }

    // visit the starting coordinate of this region
    const regionCoordinates = [coordinate];
    regions.push(regionCoordinates);
    // recursively get the next sets of coordinates to visit
    let nextCoordinatesToVisit = getCoordinatesToVisit(coordinate);
    while (nextCoordinatesToVisit.length > 0) {
      const coordinatesToVisit = nextCoordinatesToVisit;
      nextCoordinatesToVisit = [];
      coordinatesToVisit.forEach((visitingCoordinate) => {
        // record a coordinate visit for this region
        if (!includesCoordinate(regionCoordinates, visitingCoordinate)) {
          regionCoordinates.push(visitingCoordinate);
          // get the next coordinates to visit for this region
          nextCoordinatesToVisit = nextCoordinatesToVisit.concat(
            getCoordinatesToVisit(visitingCoordinate)
          );
        }
      });
    }
    // record all coordinates in this region as visited
    visited.push(...regionCoordinates);
  });
});

const answer1 = regions.reduce((acc, region) => {
  const area = region.length;
  const perimeter = region.reduce((acc, coordinates) => {
    const nextCoordinates = getCoordinatesToVisit(coordinates);
    return acc + 4 - nextCoordinates.length;
  }, 0);
  const regionKey = matrix[region[0][0]][region[0][1]];
  const price = area * perimeter;
  console.log({ regionKey, area, perimeter, price });
  return acc + price;
}, 0);

console.log("Answer Part 1:", answer1);

const answer2 = regions.reduce((acc, region) => {
  const numSides = getCorners(region);
  const regionKey = matrix[region[0][0]][region[0][1]];
  const area = region.length;
  const price = area * numSides;
  console.log({ regionKey, numSides, area, price });
  return acc + price;
}, 0);
console.log("Answer Part 2:", answer2);

function includesCoordinate(coordinateList, coordinate) {
  return coordinateList.some((coordinateToCheck) =>
    areCoordinatesEqual(coordinate, coordinateToCheck)
  );
}

function areCoordinatesEqual(coordinate1, coordinate2) {
  return coordinate1[0] === coordinate2[0] && coordinate1[1] === coordinate2[1];
}

function getCoordinatesToVisit([lineIndex, charIndex]) {
  const nextCoordinates = [];
  if (lineIndex > 0) {
    nextCoordinates.push([lineIndex - 1, charIndex]);
  }
  if (lineIndex < matrix.length - 1) {
    nextCoordinates.push([lineIndex + 1, charIndex]);
  }
  if (charIndex > 0) {
    nextCoordinates.push([lineIndex, charIndex - 1]);
  }
  if (charIndex < matrix[lineIndex].length - 1) {
    nextCoordinates.push([lineIndex, charIndex + 1]);
  }
  const char = matrix[lineIndex][charIndex];
  return nextCoordinates.filter(
    ([lineIndex, charIndex]) => matrix[lineIndex][charIndex] === char
  );
}

// count the diagonal corners on each node in the region
// a polygon has equal number of corners and sides
function getCorners(region) {
  // collect diagonal nodes for each region node
  return region.reduce((acc, regionCoordinate) => {
    const diagonalNodes = getDiagonalNodes(regionCoordinate);
    // for each diagonal node that is not part of our region
    const cournersFound = diagonalNodes.reduce((acc, node) => {
      const neighborCoordinates = getNeighbors(node);
      // check to see if it forms a corner with its neighbors
      const inclusionCheck = neighborCoordinates.map((coordinate) => includesCoordinate(region, coordinate));
      // check for acute corner
      if (inclusionCheck.every(included => included) && !includesCoordinate(region, node.coordinate)) {
        acc.push(node);
      }
      // check obtuse corner 
      else if (inclusionCheck.every(included => !included)) {
        acc.push(node);
      }
      return acc;
    }, []);
    return acc + cournersFound.length;
  }, 0);
}

function getDiagonalNodes(coordinate) {
  return DIAGONAL_NODE_TRANSFORMATIONS.map(trans => ({
    coordinate: [coordinate[0] + trans[0], coordinate[1] + trans[1]],
    trans
  }));
}

function getNeighbors(node) {
  const rightNeighbor = [node.coordinate[0], node.coordinate[1] + 1];
  const bottomNeighbor = [node.coordinate[0] + 1, node.coordinate[1]];
  const leftNeighbor = [node.coordinate[0], node.coordinate[1] - 1];
  const topNeighbor = [node.coordinate[0] - 1, node.coordinate[1]];
  switch (node.trans) {
    case DIAGONAL_NODE_TRANSFORMATIONS[0]: {
      return [rightNeighbor, bottomNeighbor];
    }
    case DIAGONAL_NODE_TRANSFORMATIONS[1]: {
      return [leftNeighbor, bottomNeighbor];
    }
    case DIAGONAL_NODE_TRANSFORMATIONS[2]: {
      return [rightNeighbor, topNeighbor];
    }
    case DIAGONAL_NODE_TRANSFORMATIONS[3]: {
      return [leftNeighbor, topNeighbor];
    }
  }
}
