const fs = require("fs");

var input = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim();

var input = fs.readFileSync("./tests/test_day4.txt", "utf8").trim();

const matrix = input.split("\n").reduce((acc, line) => {
  acc.push(
    line.split("").reduce((acc, char) => {
      acc.push(char);
      return acc;
    }, [])
  );
  return acc;
}, []);

// Part 1 - find every XMAS in the matrix

const found = new Set();

matrix.forEach((line, lineIndex) => {
  line.forEach((char, columnIndex) => {
    // start with X
    if (char !== "X") {
      return;
    }
    // check all 8 adjacent cells
    [
      [lineIndex - 1, columnIndex - 1],
      [lineIndex - 1, columnIndex],
      [lineIndex - 1, columnIndex + 1],
      [lineIndex, columnIndex - 1],
      [lineIndex, columnIndex + 1],
      [lineIndex + 1, columnIndex - 1],
      [lineIndex + 1, columnIndex],
      [lineIndex + 1, columnIndex + 1],
    ]
      // filter out coords that are out of bounds
      .filter(([x, y]) => isInBounds(matrix, [x, y]))
      .forEach(([x, y]) => {
        // check if the adjacent cell is M
        if (matrix[x][y] !== "M") {
          return;
        }
        // get the vector for the direction of X to M
        const vector = getDirection(lineIndex, columnIndex, x, y);
        // define the expected coords for A and S
        const expectedCoords = [
          { char: "A", coords: [x + vector[0], y + vector[1]] },
          { char: "S", coords: [x + vector[0] * 2, y + vector[1] * 2] },
        ];
        // check if the expected coords are in bounds and if they are the correct characters
        const coordsMatched = expectedCoords.every(({ char, coords }) => {
          const actualChar = isInBounds(matrix, coords)
            ? matrix[coords[0]][coords[1]]
            : null;
          return actualChar === char;
        });
        // if the coords match, add the matching coords of X to the found array
        if (coordsMatched) {
          found.add([lineIndex, columnIndex]);
        }
      });
  });
});

console.log("Answer Part 1:", found.size);

// Part 2 - find every X-MAS where two MAS make a cross

const found2 = new Set();

matrix.forEach((line, lineIndex) => {
  line.forEach((char, columnIndex) => {
    // start with M
    if (char !== "M") {
      return;
    }
    // check all 4 adjacent diagonal cells
    [
      [lineIndex - 1, columnIndex - 1],
      [lineIndex - 1, columnIndex + 1],
      [lineIndex + 1, columnIndex - 1],
      [lineIndex + 1, columnIndex + 1],
    ]
      // filter out coords that are out of bounds
      .filter(([x, y]) => isInBounds(matrix, [x, y]))
      // check if the adjacent cell is A
      .forEach(([x, y]) => {
        if (matrix[x][y] !== "A") {
          return;
        }
        // get the vector for the direction of M to A
        const direction = getDirection(lineIndex, columnIndex, x, y);
        // define the expected coords for S
        const sCoords = [x + direction[0], y + direction[1]];
        // check if the expected coords are in bounds and if they are the correct characters
        if (
          !isInBounds(matrix, sCoords) ||
          matrix[sCoords[0]][sCoords[1]] !== "S"
        ) {
          return;
        }

        // check if the cross also spells MAS
        const crossCoords = [
          [x + direction[0] * -1, y + direction[1]],
          [x + direction[0], y + direction[1] * -1],
        ];
        if (
          !isInBounds(matrix, crossCoords[0]) ||
          !isInBounds(matrix, crossCoords[1])
        ) {
          return;
        }

        if (
          (matrix[crossCoords[0][0]][crossCoords[0][1]] === "M" &&
            matrix[crossCoords[1][0]][crossCoords[1][1]] === "S") ||
          (matrix[crossCoords[0][0]][crossCoords[0][1]] === "S" &&
            matrix[crossCoords[1][0]][crossCoords[1][1]] === "M")
        ) {
          // add the coords of the shared A to the found set
          found2.add([x, y]);
        }
      });
  });
});

// divide by 2 because we count each direction twice
console.log("Answer Part 2:", found2.size / 2);

function isInBounds(matrix, [x, y]) {
  return x >= 0 && y >= 0 && x < matrix.length && y < matrix[x].length;
}

function getDirection(x1, y1, x2, y2) {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;
  return [xDiff, yDiff];
}
