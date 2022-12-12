import fs from "fs/promises";

/**
 * S = 0,0
 * E = 5,2
 *
 * 0,0
 * height = a
 * left = 0,-1
 * right = 0,1
 * up = -1,0
 * down = a => 1,0
 *
 * 2,5
 * height = z
 * left = 2,4
 * right = 2,6
 * down = 3,5
 * up = 1,5
 */

const EXAMPLE_INPUT1 = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

type Coordinates = [number, number, number]; // [yPosition, xPosition, height]

// https://adventofcode.com/2022/day/12
describe("Day 12 - Hill Climbing Algorithm", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day12.input")).toString().trim();
  });

  it("Part 1 - Example", () => {
    const hillMap = parseHillMap(EXAMPLE_INPUT1);
    const result = findMinStepsToEndCoordinate(hillMap);
    expect(result).toBe(31);
  });

  it("Part 1", () => {
    const hillMap = parseHillMap(input);
    const result = findMinStepsToEndCoordinate(hillMap);
    expect(result).toBe(449);
  });

  it("Part 2 - Example", () => {
    const hillMap = parseHillMap(EXAMPLE_INPUT1);
    const result = findMinStepsToTrailhead(hillMap);
    expect(result).toBe(29);
  });

  it("Part 2", () => {
    const hillMap = parseHillMap(input);
    const result = findMinStepsToTrailhead(hillMap);
    expect(result).toBe(443);
  });
});

function parseHillMap(input: string): HillMap {
  const hillMap = input
    .split("\n")
    .filter((line) => !!line)
    .reduce<HillMap>((acc, line, lineIndex) => {
      acc.grid[lineIndex] = [];
      line.split("").forEach((char, charIndex) => {
        let height = char.charCodeAt(0);
        if (char === "S") {
          height = "a".charCodeAt(0);
          acc.startCoordinates = [lineIndex, charIndex, height];
        } else if (char === "E") {
          height = "z".charCodeAt(0);
          acc.endCoordinates = [lineIndex, charIndex, height];
        }
        acc.grid[lineIndex].push(height);
      });
      return acc;
    }, new HillMap());
  return hillMap;
}

const INVALID_COORDINATES: Coordinates = [-1, -1, -1];

class HillMap {
  grid: number[][];
  startCoordinates: Coordinates;
  endCoordinates: Coordinates;

  isValidCoordinates(yPosition: number, xPosition: number) {
    return (
      yPosition > -1 &&
      yPosition < this.grid.length &&
      xPosition > -1 &&
      xPosition < this.grid[0].length
    );
  }

  constructor(grid = []) {
    this.grid = grid;
    this.startCoordinates = INVALID_COORDINATES;
    this.endCoordinates = INVALID_COORDINATES;
  }
}

function findMinSteps(
  hillMap: HillMap,
  startCoordinates: Coordinates,
  isLastStep: (nextCoordinates: Coordinates) => boolean,
  isSteppable: (
    nextCoordinates: Coordinates,
    currentCoordinates: Coordinates
  ) => boolean
) {
  let nextCoordinatesList: Coordinates[] = [startCoordinates];
  const visitedCoordinatesList: string[] = [startCoordinates.toString()];
  let step = 0;

  while (nextCoordinatesList.length > 0) {
    step++;
    const currentStepList = nextCoordinatesList;
    nextCoordinatesList = [];
    for (const currentCoordinates of currentStepList) {
      const nextList = [
        createCoordinates(currentCoordinates, 0, -1),
        createCoordinates(currentCoordinates, 0, 1),
        createCoordinates(currentCoordinates, -1, 0),
        createCoordinates(currentCoordinates, 1, 0),
      ];
      for (const nextCoordinates of nextList) {
        if (canStep(nextCoordinates, currentCoordinates)) {
          if (isLastStep(nextCoordinates)) {
            return step;
          }
          // continue path in next step
          nextCoordinatesList.push(nextCoordinates);
          visitedCoordinatesList.push(nextCoordinates.toString());
        }
      }
    }
  }
  return Infinity;

  function createCoordinates(
    currentCoordinates: Coordinates,
    xModifier = 0,
    yModifider = 0
  ): Coordinates {
    const yPosition = currentCoordinates[0] + yModifider;
    const xPosition = currentCoordinates[1] + xModifier;
    if (hillMap.isValidCoordinates(yPosition, xPosition)) {
      const height = hillMap.grid[yPosition][xPosition];
      return [yPosition, xPosition, height];
    } else {
      return INVALID_COORDINATES;
    }
  }

  function canStep(
    nextCoordinates: Coordinates,
    currentCoordinates: Coordinates
  ) {
    const next = nextCoordinates.toString();
    return (
      nextCoordinates !== INVALID_COORDINATES &&
      visitedCoordinatesList.findIndex((prev) => prev === next) === -1 &&
      isSteppable(nextCoordinates, currentCoordinates)
    );
  }
}

function findMinStepsToEndCoordinate(hillMap: HillMap) {
  return findMinSteps(
    hillMap,
    hillMap.startCoordinates,
    isLastStep,
    isStepppable
  );

  function isLastStep(nextCoordinates: Coordinates) {
    return (
      nextCoordinates[0] === hillMap.endCoordinates[0] &&
      nextCoordinates[1] === hillMap.endCoordinates[1]
    );
  }

  function isStepppable(
    nextCoordinates: Coordinates,
    currentCoordinates: Coordinates
  ) {
    return nextCoordinates[2] - currentCoordinates[2] < 2;
  }
}

function findMinStepsToTrailhead(hillMap: HillMap) {
  return findMinSteps(
    hillMap,
    hillMap.endCoordinates,
    isLastStep,
    isStepppable
  );

  function isLastStep(nextCoordinates: Coordinates) {
    return nextCoordinates[2] === "a".charCodeAt(0);
  }

  function isStepppable(
    nextCoordinates: Coordinates,
    currentCoordinates: Coordinates
  ) {
    return nextCoordinates[2] - currentCoordinates[2] > -2;
  }
}
