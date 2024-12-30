const fs = require("fs");
let input = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`.trim();

input = fs.readFileSync('./tests/test_day15.txt', 'utf8').trim();

// parse input into lists of box coordinates, wall coordinates, the robot coordinate, and the robot moves
const positions = parseInput(input, "part1");
// console.log(printPositions(positions));
simulateRobotMovesPart1(positions);
// console.log(printPositions(positions));
console.log(
  "Answer Part 1:",
  positions.boxPositions.reduce(
    (acc, boxPosition) => acc + boxPosition[0] * 100 + boxPosition[1],
    0
  )
);

const positions2 = parseInput(input, "part2");
// console.log(printPositions(positions2));
simulateRobotMovesPart2(positions2);
// console.log(printPositions(positions2));
console.log(
  "Answer Part 2:",
  positions2.boxPositions.reduce(
    (acc, boxPosition) => acc + boxPosition[0][0] * 100 + boxPosition[0][1],
    0
  )
);

function parseInput(input, variant = "part1") {
  return input.split("\n").reduce(
    (acc, line, lineIndex) => {
      if (line === "") {
        acc.parseMode = "robotMoves";
      }
      if (acc.parseMode === "robotMoves") {
        acc.robotMoves = acc.robotMoves.concat(line.split(""));
      } else {
        const lineChars = line.split("");
        if (variant === "part1") {
          lineChars.forEach((char, charIndex) => {
            if (char === "O") {
              acc.boxPositions.push([lineIndex, charIndex]);
            }
            if (char === "#") {
              acc.wallPositions.push([lineIndex, charIndex]);
            }
            if (char === "@") {
              acc.startingRobotPosition = [lineIndex, charIndex];
              acc.lastRobotPosition = acc.startingRobotPosition;
            }
          });
          acc.spaceDimensions = [lineIndex + 1, lineChars.length];
        } else if (variant === "part2") {
          lineChars.forEach((char, charIndex) => {
            charIndex = charIndex * 2;
            if (char === "O") {
              acc.boxPositions.push([
                [lineIndex, charIndex],
                [lineIndex, charIndex + 1],
              ]);
            }
            if (char === "#") {
              acc.wallPositions = acc.wallPositions.concat([
                [lineIndex, charIndex],
                [lineIndex, charIndex + 1],
              ]);
            }
            if (char === "@") {
              acc.startingRobotPosition = [lineIndex, charIndex];
              acc.lastRobotPosition = acc.startingRobotPosition;
            }
          });
          acc.spaceDimensions = [lineIndex + 1, lineChars.length * 2];
        }
      }
      return acc;
    },
    {
      boxPositions: [],
      wallPositions: [],
      startingRobotPosition: [],
      lastRobotPosition: [],
      robotMoves: [],
      parseMode: "boxPositions",
      spaceDimensions: [],
      variant,
    }
  );
}

function simulateRobotMovesPart1(positions) {
  // update the box positions with each move
  positions.robotMoves.forEach((move) => {
    const nextRobotPosition = getNextPosition(
      move,
      positions.lastRobotPosition
    );
    const mapValueAtNextRobotPosition = getPositionValue(nextRobotPosition);
    switch (mapValueAtNextRobotPosition) {
      case ".": {
        setPositionValue(positions.lastRobotPosition, ".");
        positions.lastRobotPosition = nextRobotPosition;
        break;
      }
      case "O": {
        pushBoxes(
          move,
          nextRobotPosition
        );
        break;
      }
      case "#":
      default: {
        break;
      }
    }
  });

  function getPositionValue(coordinate) {
    if (positions.wallPositions.some((position) => isSameCoordinate(position, coordinate))) {
      return "#";
    }
    if (positions.boxPositions.some((position) => isSameCoordinate(position, coordinate))) {
      return "O";
    }
    return ".";
  }

  function setPositionValue(coordinate, value) {
    positions.boxPositions = positions.boxPositions.filter((position) => !isSameCoordinate(position, coordinate));
    if (value === "O") {
      positions.boxPositions = positions.boxPositions.concat([coordinate]);
    }
  }

  function isSameCoordinate(coordinate1, coordinate2) {
    return coordinate1[0] === coordinate2[0] && coordinate1[1] === coordinate2[1];
  }

  function pushBoxes(move, robotPosition) {
    let nextBoxPosition = robotPosition;
    let mapValueAtNextBoxPosition = "O";
    while (mapValueAtNextBoxPosition === "O") {
      nextBoxPosition = getNextPosition(move, nextBoxPosition);
      mapValueAtNextBoxPosition = getPositionValue(nextBoxPosition, positions);
    }
    if (mapValueAtNextBoxPosition === ".") {
      setPositionValue(nextBoxPosition, "O");
      setPositionValue(positions.lastRobotPosition, ".");
      positions.lastRobotPosition = robotPosition;
    }
  }
}

function simulateRobotMovesPart2(positions) {
  // update the box positions with each move
  positions.robotMoves.forEach((move) => {
    const nextRobotPosition = getNextPosition(
      move,
      positions.lastRobotPosition
    );
    const mapValueAtNextRobotPosition = getPositionValue(nextRobotPosition);
    switch (mapValueAtNextRobotPosition) {
      case ".": {
        setPositionValue(positions.lastRobotPosition, ".");
        positions.lastRobotPosition = nextRobotPosition;
        break;
      }
      case "[":
      case "]": {
        let boxesToPush = [];
        if (move === "<" || move === ">") {
          boxesToPush = getBoxesToPushHorizontal(move, nextRobotPosition);
        } else if (move === "^" || move === "v") {
          boxesToPush = getBoxesToPushVertical(move, nextRobotPosition, mapValueAtNextRobotPosition);
        }
        if (boxesToPush.length > 0) {
          pushBoxes(boxesToPush, move);
          positions.lastRobotPosition = nextRobotPosition;
        }
        break;
      }
      case "#":
      default: {
        break;
      }
    }
  });

  function getPositionValue(coordinate) {
    if (positions.wallPositions.some((wall) => wall[0] === coordinate[0] && wall[1] === coordinate[1])) {
      return "#";
    }

    if (positions.boxPositions.some((box) => box[0][0] === coordinate[0] && box[0][1] === coordinate[1])) {
      return "[";
    }
    if (positions.boxPositions.some((box) => box[1][0] === coordinate[0] && box[1][1] === coordinate[1])
    ) {
      return "]";
    }

    return ".";
  }

  function setPositionValue(coordinate, value) {
    // clear boxes from new position
    positions.boxPositions = positions.boxPositions.filter((box) =>
      !(box[0][0] === coordinate[0] && box[0][1] === coordinate[1]) &&
      !(box[1][0] === coordinate[0] && box[1][1] === coordinate[1])
    );
    // place box in new position
    if (value === "[") {
      positions.boxPositions = positions.boxPositions.concat([
        [coordinate, [coordinate[0], coordinate[1] + 1]],
      ]);
    } else if (value === "]") {
      positions.boxPositions = positions.boxPositions.concat([
        [[coordinate[0], coordinate[1] - 1], coordinate],
      ]);
    }
  }

  function getBoxesToPushVertical(move, nextRobotPosition, mapValueAtNextRobotPosition) {
    const boxesToPush = [];

    // scan each row and collect boxes to push
    // once we find a row with enough free space, return the collected boxes
    // if we hit a wall, no boxes can be pushed
    let nextIndicesToCheck = new Set();
    if (mapValueAtNextRobotPosition === "[") {
      nextIndicesToCheck.add(nextRobotPosition[1])
      nextIndicesToCheck.add(nextRobotPosition[1] + 1);

    } else {
      nextIndicesToCheck.add(nextRobotPosition[1] - 1);
      nextIndicesToCheck.add(nextRobotPosition[1]);
    }

    let row = nextRobotPosition[0];
    // repeat the scan for each row where we can push boxes
    while (nextIndicesToCheck.size > 0) {
      const indicesToCheck = nextIndicesToCheck;
      nextIndicesToCheck = new Set();
      for (col of indicesToCheck) {
        let value = getPositionValue([row, col]);
        // console.log({ row, col, value });
        // check if the space is free
        if (value === '.') {
          continue;
        }

        // check if we hit a wall
        if (value === '#') {
          // return 0 boxes
          return [];
        }

        // check if we hit a box
        // if so, collect the box and adjust the indices of the next row to scan
        if (value === '[') {
          if (!containsBox(boxesToPush, [row, col])) {
            boxesToPush.push([[row, col], [row, col + 1]]);
          }
          nextIndicesToCheck.add(col);
          nextIndicesToCheck.add(col + 1);
        }
        if (value === ']') {
          if (!containsBox(boxesToPush, [row, col - 1])) {
            boxesToPush.push([[row, col - 1], [row, col]]);
          }
          nextIndicesToCheck.add(col - 1);
          nextIndicesToCheck.add(col);
        }
      }
      row = move === "^" ? row - 1 : row + 1;
    }
    return boxesToPush;
  }

  function getBoxesToPushHorizontal(move, nextRobotPosition) {
    boxesToPush = [];
    let nextBoxPosition = nextRobotPosition;
    let mapValueAtNextBoxPosition = getPositionValue(nextBoxPosition, positions);
    while (["[", "]"].includes(mapValueAtNextBoxPosition)) {
      if (mapValueAtNextBoxPosition === '[' && !containsBox(boxesToPush, nextBoxPosition)) {
        boxesToPush.push([nextBoxPosition, [nextBoxPosition[0], nextBoxPosition[1] + 1]]);
      }
      nextBoxPosition = getNextPosition(move, nextBoxPosition);
      mapValueAtNextBoxPosition = getPositionValue(nextBoxPosition, positions);
    }
    if (mapValueAtNextBoxPosition === "#") {
      return [];
    }
    return boxesToPush;
  }

  function containsBox(boxes, coordinate) {
    return boxes.some((box) => box[0][0] === coordinate[0] && box[0][1] === coordinate[1]);
  }

  function pushBoxes(boxesToPush, move) {
    // remove all boxes to push from their current positions
    positions.boxPositions = positions.boxPositions.filter((box) => !containsBox(boxesToPush, box[0]) && !containsBox(boxesToPush, box[1]));
    // place all boxes in their new positions
    const boxesToAdd = boxesToPush.map((box) => {
      if (move === '^') {
        return [[box[0][0] - 1, box[0][1]], [box[1][0] - 1, box[1][1]]];
      }
      if (move === 'v') {
        return [[box[0][0] + 1, box[0][1]], [box[1][0] + 1, box[1][1]]];
      }
      if (move === '<') {
        return [[box[0][0], box[0][1] - 1], [box[1][0], box[1][1] - 1]];
      }
      if (move === '>') {
        return [[box[0][0], box[0][1] + 1], [box[1][0], box[1][1] + 1]];
      }
    });
    positions.boxPositions = positions.boxPositions.concat(boxesToAdd);
  }
}

function getNextPosition(move, coordinate) {
  switch (move) {
    case "^": {
      return [coordinate[0] - 1, coordinate[1]];
    }
    case "v": {
      return [coordinate[0] + 1, coordinate[1]];
    }
    case "<": {
      return [coordinate[0], coordinate[1] - 1];
    }
    case ">": {
      return [coordinate[0], coordinate[1] + 1];
    }
  }
}

function printPositions(positions) {
  const map = Array.from({ length: positions.spaceDimensions[0] }, () =>
    Array.from({ length: positions.spaceDimensions[1] }, () => ".")
  );
  positions.wallPositions.forEach((position) => {
    map[position[0]][position[1]] = "#";
  });
  if (positions.variant === "part1") {
    positions.boxPositions.forEach((position) => {
      map[position[0]][position[1]] = "O";
    });
  } else if (positions.variant === "part2") {
    positions.boxPositions.forEach((position) => {
      map[position[0][0]][position[0][1]] = "[";
      map[position[1][0]][position[1][1]] = "]";
    });
  }
  map[positions.lastRobotPosition[0]][positions.lastRobotPosition[1]] = "@";

  return map.map((row) => row.join("")).join("\n");
}
