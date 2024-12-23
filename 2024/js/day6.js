const { dir } = require("console");
const fs = require("fs");
const { start } = require("repl");

var input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

// var input = fs.readFileSync("./tests/test_day6.txt", "utf8").trim();


const matrix = input.split("\n").filter(Boolean).map((line) => line.split(""));

// Part 1 - find coordinates visited by the guard
var startTime = performance.now();

const guardStartingCoords = findGuardCoordinates(matrix);
const guardStartingDirection = [-1, 0];
const { visited } = runSimulation(matrix, guardStartingCoords, guardStartingDirection);

const uniqueCoordinates = visited.reduce((acc, { coordinate }) => {
  if (!acc.some(([x, y]) => x === coordinate[0] && y === coordinate[1])) {
    acc.push(coordinate);
  }
  return acc;
}, []);

console.log("Answer Part 1:", uniqueCoordinates.length);
var endTime = performance.now();
var duration = endTime - startTime;
console.log(`Duration: ${duration}ms`);

// Part 2 - find positions for obstructions to create infinite loops
var startTime = performance.now();

const possibleObstructionCoordinates = [];
const stats = uniqueCoordinates.map((coordinate, index) => {
  // cannot obstruct guard starting position
  if (coordinate[0] == guardStartingCoords[0] && coordinate[1] == guardStartingCoords[1]) {
    return;
  }
  let startTime = performance.now();

  // add an obstruction at this coordinate
  matrix[coordinate[0]][coordinate[1]] = "O";
  // run simulation with this obstruction
  // start the guard in the position before this one
  // to do that we'll need to know the first direction the guard passed for this coordinate
  const { direction } = visited.find(({ coordinate: [x, y] }) => {
    return coordinate[0] === x && coordinate[1] === y;
  });
  // and apply it backwards to get the previous coordinate
  const startingCoords = [coordinate[0] - direction[0], coordinate[1] - direction[1]];
  const { guardExited } = runSimulation(matrix, startingCoords, direction);
  if (!guardExited) {
    possibleObstructionCoordinates.push(coordinate);
  }
  // remove the obstruction
  matrix[coordinate[0]][coordinate[1]] = ".";
  let endTime = performance.now();
  let duration = endTime - startTime;
  return {
    coordinate,
    duration,
    guardExited
  }
}).filter(Boolean);

console.log("Answer Part 2:", possibleObstructionCoordinates.length);
var endTime = performance.now();
var duration = endTime - startTime;
console.log(`Duration: ${duration / 1000} seconds`);
console.log('Simulations Run:', stats.length);
console.log('Possible Obstructions:', possibleObstructionCoordinates.length);
console.log('Max Duration:', stats.reduce((acc, { duration }) => Math.max(acc, duration), 0));
console.log('Mean Duration:', stats.reduce((acc, { duration }) => acc + duration, 0) / stats.length);
console.log('Min Duration:', stats.reduce((acc, { duration }) => Math.min(acc, duration), Infinity));
console.log('Max Duration When Obstructed:', stats.filter(({ guardExited }) => !guardExited).reduce((acc, { duration }) => Math.max(acc, duration), 0));
console.log('Mean Duration When Obstructed:', stats.filter(({ guardExited }) => !guardExited).reduce((acc, { duration }) => acc + duration, 0) / stats.filter(({ guardExited }) => !guardExited).length);
console.log('Min Duration When Obstructed:', stats.filter(({ guardExited }) => !guardExited).reduce((acc, { duration }) => Math.min(acc, duration), Infinity));
console.log('Max Duration When Guard Exits:', stats.filter(({ guardExited }) => guardExited).reduce((acc, { duration }) => Math.max(acc, duration), 0));
console.log('Mean Duration When Guard Exits:', stats.filter(({ guardExited }) => guardExited).reduce((acc, { duration }) => acc + duration, 0) / stats.filter(({ guardExited }) => guardExited).length);
console.log('Min Duration When Guard Exits:', stats.filter(({ guardExited }) => guardExited).reduce((acc, { duration }) => Math.min(acc, duration), Infinity));


function findGuardCoordinates(matrix) {
  for (let lineIndex = 0; lineIndex < matrix.length; lineIndex++) {
    const line = matrix[lineIndex];
    for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
      const char = line[columnIndex];
      if (char === "^") {
        return [lineIndex, columnIndex];
      }
    }
  }
}

function isInBounds(matrix, [x, y]) {
  return x >= 0 && y >= 0 && x < matrix.length && y < matrix[x].length;
}

function containsCoordinate(visited, coordinateToCheck) {
  return visited.some(({ coordinate: [x, y] }) => x === coordinateToCheck[0] && y === coordinateToCheck[1]);
}

function containsCoordinateAndDirection(visited, coordinateToCheck, directionToCheck) {
  return visited.some(({ coordinate, direction }) => {
    return coordinate[0] === coordinateToCheck[0]
      && coordinate[1] === coordinateToCheck[1]
      && direction[0] === directionToCheck[0]
      && direction[1] === directionToCheck[1];
  });
}

function runSimulation(matrix, guardStartingCoords, guardStartingDirection) {
  const visited = [];
  let guardExited = true;

  let guardCoords = guardStartingCoords;
  let guardDirection = guardStartingDirection;
  while (isInBounds(matrix, guardCoords)) {
    if (!containsCoordinateAndDirection(visited, guardCoords, guardDirection)) {
      visited.findIndex(({ coordinate: [x, y] }) => x === guardCoords[0] && y === guardCoords[1]);
      visited.push({ coordinate: guardCoords, direction: guardDirection });
    } else {
      // if guard has visited the this coordinate in this direction, then we've entered an infinite loop
      // console.log("Guard entered infinite loop", guardCoords, guardDirection);
      guardExited = false;
      break;
    }
    // change direction until unblocked
    let nextCoordinates = [guardCoords[0] + guardDirection[0], guardCoords[1] + guardDirection[1]];
    while (isInBounds(matrix, nextCoordinates)) {
      const nextChar = matrix[nextCoordinates[0]][nextCoordinates[1]];
      // break if the next move is not blocked
      if (nextChar !== "#" && nextChar !== "O") {
        break;
      }
      // turn right and try again
      if (Math.abs(guardDirection[0]) === 1) {
        guardDirection = [0, -guardDirection[0]];
      } else {
        guardDirection = [guardDirection[1], 0];
      }
      nextCoordinates = [guardCoords[0] + guardDirection[0], guardCoords[1] + guardDirection[1]];
    }
    // take a step
    guardCoords = [guardCoords[0] + guardDirection[0], guardCoords[1] + guardDirection[1]];
  }

  return {
    visited,
    guardExited
  };
}

function printGuardPath(matrix, visited) {
  console.log(
    matrix.map((line, lineIndex) =>
      line.map((char, columnIndex) => {
        if (containsCoordinate(visited, [lineIndex, columnIndex])) {
          return "X";
        }
        return char;
      })
        .join("")
    ).join("\n")
  );
}
