const fs = require("fs");
let input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

input = fs.readFileSync("./tests/test_day10.txt", "utf8").trim();

// convert input into a 2d matrix with rows as x and columns as y
const matrix = input.split("\n").map((line) => line.split("").map((char) => parseInt(char, 10)));

// walk each row and look for trailheads
const TRAILHEAD = 0;
const SUMMIT = 9;
let scoreSum = 0;
matrix.forEach((row, rowIndex) => {
  row.forEach((cell, colIndex) => {
    if (cell === TRAILHEAD) {
      const score = determineTrailScore(rowIndex, colIndex);
      scoreSum += score;
    }
  });
});
console.log("Answer Part 1:", scoreSum);

let ratingSum = 0;
matrix.forEach((row, rowIndex) => {
  row.forEach((cell, colIndex) => {
    if (cell === TRAILHEAD) {
      const rating = determineTrailRating(rowIndex, colIndex);
      ratingSum += rating;
    }
  });
});
console.log("Answer Part 2:", ratingSum);

function determineTrailScore(rowIndex, colIndex) {
  const origin = [rowIndex, colIndex];
  const visited = [origin];
  let score = 0;
  let currentElevation = 0;
  // look for neighbors that are 1 elevation higher
  let nextSteps = findNextSteps(origin, currentElevation);
  while (currentElevation < 9 && nextSteps.length > 0) {
    currentElevation++;
    // once we reach the summit, we can count the number of steps to get there
    if (currentElevation === 9) {
      score = nextSteps.length;
    } else {
      // find the next steps that are 1 elevation higher
      nextSteps = nextSteps.reduce((acc, coordinates) => acc.concat(findNextSteps(coordinates, currentElevation)), []);
      // dedupe the next steps
      nextSteps = nextSteps.filter((coordinates) => {
        const isVisited = visited.some((visitedCoordinates) => {
          return visitedCoordinates[0] === coordinates[0] && visitedCoordinates[1] === coordinates[1];
        });
        if (!isVisited) {
          visited.push(coordinates);
        }
        return !isVisited;
      });
    }
  }
  return score;
}

function determineTrailRating(rowIndex, colIndex) {
  const origin = [rowIndex, colIndex];
  let score = 0;
  let currentElevation = 0;
  let nextSteps = findNextSteps(origin, currentElevation);
  while (currentElevation < 9 && nextSteps.length > 0) {
    currentElevation++;
    if (currentElevation === 9) {
      score = nextSteps.length;
    } else {
      nextSteps = nextSteps.reduce((acc, coordinates) => acc.concat(findNextSteps(coordinates, currentElevation)), []);
    }
  }
  return score;
}

function findNextSteps([rowIndex, colIndex], currentElevation) {
  const coordinatesToCheck = [];

  if (rowIndex > 0) {
    coordinatesToCheck.push([rowIndex - 1, colIndex]);
  }
  if (rowIndex < matrix.length - 1) {
    coordinatesToCheck.push([rowIndex + 1, colIndex]);
  }
  if (colIndex > 0) {
    coordinatesToCheck.push([rowIndex, colIndex - 1]);
  }
  if (colIndex < matrix[0].length - 1) {
    coordinatesToCheck.push([rowIndex, colIndex + 1]);
  }

  return coordinatesToCheck.filter(([rowIndex, colIndex]) => {
    const cell = matrix[rowIndex][colIndex];
    return cell === currentElevation + 1;
  });
}
