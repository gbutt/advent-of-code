import fs from "fs/promises";
import { range, addVectors } from "./helpers";

const EXAMPLE_INPUT1 = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;
const EXAMPLE_INPUT2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;

type Coordinates = [number, number];
interface Step {
  direction: "R" | "L" | "U" | "D";
  count: number;
}

// https://adventofcode.com/2022/day/9
describe("Day 9 - Rope Bridge", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day9.input")).toString().trim();
  });

  it("Part 1 - Examples", () => {
    const steps = parseSteps(EXAMPLE_INPUT1);
    const result = runSimulation(steps, 1);
    expect(result).toBe(13);
  });

  it("Part 1", () => {
    const steps = parseSteps(input);
    const result = runSimulation(steps, 1);
    expect(result).toBe(6470);
  });

  it("Part 2 - Example - 1", () => {
    const steps = parseSteps(EXAMPLE_INPUT1);
    const result = runSimulation(steps, 9);
    expect(result).toBe(1);
  });

  it("Part 2 - Example - 2", () => {
    const steps = parseSteps(EXAMPLE_INPUT2);
    const result = runSimulation(steps, 9);
    expect(result).toBe(36);
  });

  it("Part 2", () => {
    const steps = parseSteps(input);
    const result = runSimulation(steps, 9);
    expect(result).toBe(2658);
  });
});

function parseSteps(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .map((line) => {
      const parts = line.split(" ");
      return {
        direction: parts[0],
        count: parseInt(parts[1], 10),
      } as Step;
    });
}

function runSimulation(steps: Array<Step>, numberOfTailNodes: number) {
  // Array with positions of each node: the head node and all tail nodes
  // Each node starts at position 0, 0
  const nodeCount = numberOfTailNodes + 1;
  const nodeList = range(0, nodeCount).map(() => [0, 0] as Coordinates);

  // run the simulation for each step
  const lastNodeVisits = steps.reduce((lastNodeVisits, step) => {
    const directionVector = determineDirection(step.direction);
    // move nodes once for each step count
    range(0, step.count).forEach(() => {
      updateNodePositions(nodeList, directionVector);
      // collect a set of unique coordinates visited by the last tail node
      const lastTailNode = nodeList[nodeList.length - 1];
      lastNodeVisits.add(lastTailNode.toString());
    });
    return lastNodeVisits;
  }, new Set<string>(["0,0"]));

  // return number of unique coordinates visited by the last tail
  return lastNodeVisits.size;
}

function updateNodePositions(
  nodeList: Array<Coordinates>,
  directionVector: [number, number]
) {
  nodeList.forEach((currentNode, currentNodeIndex) => {
    if (currentNodeIndex === 0) {
      // move head
      nodeList[0] = addVectors(currentNode, directionVector) as Coordinates;
    } else {
      // move tail
      const currentHeadNode = nodeList[currentNodeIndex - 1];
      moveTail(currentHeadNode, currentNode);
    }
  });
}

function moveTail(headPosition: Coordinates, tailPosition: Coordinates) {
  const xDiff = headPosition[0] - tailPosition[0];
  const yDiff = headPosition[1] - tailPosition[1];
  if (Math.abs(xDiff) > 1) {
    // move x by one
    tailPosition[0] += xDiff > 0 ? 1 : -1;
    if (Math.abs(yDiff) > 0) {
      // diagonal move
      tailPosition[1] += yDiff > 0 ? 1 : -1;
    }
  } else if (Math.abs(yDiff) > 1) {
    // move y by one
    tailPosition[1] += yDiff > 0 ? 1 : -1;
    if (Math.abs(xDiff) > 0) {
      // diagonal move
      tailPosition[0] += xDiff > 0 ? 1 : -1;
    }
  }
}

/**
 * determine the direction vectors on the x and y planes that correspond to the direction
 */
function determineDirection(direction: Step["direction"]) {
  return DIRECTION_VECTOR_MAP[direction] as [number, number];
}

const DIRECTION_VECTOR_MAP = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
} as const;
