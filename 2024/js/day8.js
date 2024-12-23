const fs = require('fs');

var input = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

var input = fs.readFileSync("./tests/test_day8.txt", "utf8").trim();

const antennaeCoordinates = {};
const matrix = input.split("\n").reduce((acc, line, lineIndex) => {
  acc.push(
    line.split("").reduce((acc, char, colIndex) => {
      acc.push(char);
      if (char !== '.') {
        let coordinatesList = antennaeCoordinates[char];
        if (!coordinatesList) {
          coordinatesList = [];
          antennaeCoordinates[char] = coordinatesList;
        }
        coordinatesList.push([lineIndex, colIndex]);
      }
      return acc;
    }, [])
  );
  return acc;
}, []);


let antinodes = [];
Object.keys(antennaeCoordinates).forEach((frequency) => {
  const coordinateList = antennaeCoordinates[frequency];
  // compare each pair of coordinates to find their antinodes
  for (let i = 0; i < coordinateList.length; i++) {
    for (let j = i + 1; j < coordinateList.length; j++) {
      const vector = getVector(coordinateList[i], coordinateList[j]);
      const antinode1 = [coordinateList[i][0] + vector[0] * 2, coordinateList[i][1] + vector[1] * 2];
      const antinode2 = [coordinateList[j][0] - vector[0] * 2, coordinateList[j][1] - vector[1] * 2];
      // add the antinodes if they are located within bounds of the matrix
      if (isInBounds(antinode1)) {
        pushNoDupes(antinodes, antinode1);
      }
      if (isInBounds(antinode2)) {
        pushNoDupes(antinodes, antinode2);
      }
    }
  }
});

console.log("Answer Part 1:", antinodes.length);

// Part 2

antinodes = [];
Object.keys(antennaeCoordinates).forEach((frequency) => {
  const coordinateList = antennaeCoordinates[frequency];
  const solvedAntennae = [];
  // compare each pair of coordinates to find their antinodes
  for (let i = 0; i < coordinateList.length; i++) {
    for (let j = i + 1; j < coordinateList.length; j++) {
      if (i === j) {
        continue;
      }
      let vector = getVector(coordinateList[i], coordinateList[j]);
      collectAntinodes(coordinateList[i], vector, antinodes, solvedAntennae);
      collectAntinodes(coordinateList[j], vector, antinodes, solvedAntennae);
    }
  }
});

console.log("Answer Part 2:", antinodes.length);


function getVector(aCoords, bCoords) {
  return [bCoords[0] - aCoords[0], bCoords[1] - aCoords[1]];
}

function collectAntinodes(coordinate, vector, antinodes, solvedAntennae) {
  const hasBeenSolved = solvedAntennae.some((antenna) =>
    antenna.coordinate[0] === coordinate[0]
    && antenna.coordinate[1] === coordinate[1]
    && antenna.vector[0] === vector[0]
    && antenna.vector[1] === vector[1]);
  if (hasBeenSolved) {
    return;
  } else {
    solvedAntennae.push({ coordinate, vector });
  }

  let iterations = 0;
  let nextCoords;
  const x = coordinate[0];
  const y = coordinate[1];
  // console.log({ coordinate, vector });
  do {
    iterations++;
    const dx = (vector[0] * iterations) / vector[1];
    const dy = iterations;
    nextCoords = [[x + dx, y + dy], [x - dx, y - dy]];
    // console.log({ nextCoords, dx, dy });
    nextCoords = nextCoords.filter((nextCoord) => {
      return isInBounds(nextCoord);
    })
    nextCoords.forEach((nextCoord) => {
      // if next coordinates are not fractional numbers, then an antinode is found
      if (Number.isInteger(nextCoord[0]) && Number.isInteger(nextCoord[1])) {
        pushNoDupes(antinodes, nextCoord);
      }
    });
  } while (nextCoords.length > 0);
}

function isInBounds([x, y]) {
  return x >= 0 && y >= 0 && y < matrix.length && x < matrix[y].length;
}

function pushNoDupes(antinodes, antinode) {
  if (antinodes.find(([x, y]) => x === antinode[0] && y === antinode[1]) === undefined) {
    antinodes.push(antinode);
  }
}
