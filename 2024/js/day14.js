const fs = require("fs");
// import day 14 input
let input = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`.trim();
let bathroomDimensions = [11, 7];
input = fs.readFileSync("./tests/test_day14.txt", "utf-8").trim();
bathroomDimensions = [101, 103];

// parse input into robots
const { startingPositions, changeInPositions } = input
  .split("\n")
  .map((line) => {
    const [_, px, py, vx, vy] = line
      .match(/p=(.+),(.+) v=(.+),(.+)/)
      .map(Number);
    return { startingPosition: [px, py], changeInPosition: [vx, vy] };
  })
  .reduce(
    (acc, robot) => {
      acc.startingPositions.push(robot.startingPosition);
      acc.changeInPositions.push(robot.changeInPosition);
      return acc;
    },
    { startingPositions: [], changeInPositions: [] }
  );

// move robots for 100 seconds
let currentPositions = JSON.parse(JSON.stringify(startingPositions));
Array(100)
  .fill()
  .forEach((_, index) => {
    moveRobots([currentPositions, changeInPositions]);
  });
// determine the quadrant in which each robot lands
const quadrantBoundaries = getQuadrantBoundaries();
const answer1 = quadrantBoundaries.map(({ xMin, xMax, yMin, yMax }) =>
  currentPositions.filter(([x, y]) => {
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
  })
);
// printBathroom(currentPositions, bathroomDimensions, quadrantBorders);
console.log(
  "Answer Part 1:",
  answer1.map((quadrant) => quadrant.length).reduce((a, b) => a * b, 1)
);

// move robots unit we have a tree
currentPositions = JSON.parse(JSON.stringify(startingPositions));
Array(10000)
  .fill()
  .forEach((_, index) => {
    moveRobots([currentPositions, changeInPositions]);
    const bathroomMap = printBathroom(currentPositions, bathroomDimensions);
    const hasTree = bathroomMap.split("\n").some((row) => row.match(/\d{7}/));
    if (hasTree) {
      console.log(bathroomMap + "\n");
      console.log('Answer Part 2:', index + 1);
      process.exit(0);
    }
  });

function moveRobots([currentPositions, changeInPositions]) {
  changeInPositions.forEach(([vx, vy], index) => {
    let currentPosition = currentPositions[index];
    let newX = (currentPosition[0] + vx) % bathroomDimensions[0];
    if (newX < 0) {
      newX = bathroomDimensions[0] + newX;
    }
    let newY = (currentPosition[1] + vy) % bathroomDimensions[1];
    if (newY < 0) {
      newY = bathroomDimensions[1] + newY;
    }
    currentPosition[0] = newX;
    currentPosition[1] = newY;
  });
}

function printBathroom(currentPositions, bathroomDimensions, quadrantBorders) {
  const bathroom = Array(bathroomDimensions[1])
    .fill()
    .map(() => Array(bathroomDimensions[0]).fill("."));
  currentPositions.forEach(([x, y]) => {
    if (bathroom[y][x] === ".") {
      bathroom[y][x] = "1";
    } else {
      const currentValue = parseInt(bathroom[y][x], 10);
      bathroom[y][x] = (currentValue + 1).toString();
    }
  });

  if (quadrantBorders) {
    bathroom.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (x === quadrantBorders[0] || y === quadrantBorders[1]) {
          bathroom[y][x] = " ";
        }
      });
    });
  }
  return bathroom.map((row) => row.join("")).join("\n");
}

function getQuadrantBoundaries() {
  const quadrantBorders = [
    (bathroomDimensions[0] - 1) / 2,
    (bathroomDimensions[1] - 1) / 2,
  ];
  return [
    {
      xMin: 0,
      xMax: quadrantBorders[0] - 1,
      yMin: 0,
      yMax: quadrantBorders[1] - 1,
    },
    {
      xMin: quadrantBorders[0] + 1,
      xMax: bathroomDimensions[0] - 1,
      yMin: 0,
      yMax: quadrantBorders[1] - 1,
    },
    {
      xMin: quadrantBorders[0] + 1,
      xMax: bathroomDimensions[0] - 1,
      yMin: quadrantBorders[1] + 1,
      yMax: bathroomDimensions[1] - 1,
    },
    {
      xMin: 0,
      xMax: quadrantBorders[0] - 1,
      yMin: quadrantBorders[1] + 1,
      yMax: bathroomDimensions[1] - 1,
    },
  ];
}
