import fs from "fs/promises";
import { range } from "./helpers";

const EXAMPLE_INPUT1 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

interface NoopInstruction {
  operation: "noop";
}
interface AddXInstruction {
  operation: "addx";
  value: number;
}
type Instruction = NoopInstruction | AddXInstruction;

const OPERATION_CYCLE_MAP = {
  noop: 1,
  addx: 2,
} as const;

// https://adventofcode.com/2022/day/10
describe("Day 10 - Cathode-Ray Tube", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day10.input")).toString().trim();
  });

  it("Part 1 - Examples", () => {
    const instructions = parseInstructions(EXAMPLE_INPUT1);
    expect(sumSignalStrengths(instructions)).toBe(13140);
  });

  it("Part 1", () => {
    const instructions = parseInstructions(input);
    expect(sumSignalStrengths(instructions)).toBe(13820);
  });

  it("Part 2 - Example", () => {
    const instructions = parseInstructions(EXAMPLE_INPUT1);
    const screenWidth = 40;
    const pixels = renderPixels(instructions, screenWidth);
    const result = drawResult(pixels, screenWidth);

    expect(result).toBe(`
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......###.
#######.......#######.......#######.....`);
  });
  it("Part 2", () => {
    const instructions = parseInstructions(input);
    const screenWidth = 40;
    const crt = renderPixels(instructions, screenWidth);
    const result = drawResult(crt, screenWidth);

    expect(result).toBe(`
####.#..#..##..###..#..#..##..###..#..#.
...#.#.#..#..#.#..#.#.#..#..#.#..#.#.#..
..#..##...#....#..#.##...#....#..#.##...
.#...#.#..#.##.###..#.#..#.##.###..#.#..
#....#.#..#..#.#.#..#.#..#..#.#.#..#.#..
####.#..#..###.#..#.#..#..###.#..#.#..#.`);
  });
});

function parseInstructions(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .map((line) => {
      const parts = line.split(" ");
      return {
        operation: parts[0],
        value: parts.length > 1 && parseInt(parts[1], 10),
      } as Instruction;
    });
}

function sumSignalStrengths(
  instructions: Array<Instruction>,
  startCycle = 20,
  step = 40,
  iterations = 6
) {
  const signalStrengthSum = range(startCycle, iterations, step).reduce(
    (acc, currentCycle) => {
      const value = determineValueAtCycle(currentCycle, instructions);
      const signalStrength = value * currentCycle;
      return acc + signalStrength;
    },
    0
  );
  return signalStrengthSum;
}

function determineValueAtCycle(
  endCycle: number,
  instructions: Array<Instruction>
) {
  const startingValue = 1;
  let currentCycle = 1;
  let currentValue = startingValue;
  for (const instruction of instructions) {
    const cycleTime = OPERATION_CYCLE_MAP[instruction.operation];
    if (currentCycle + cycleTime > endCycle) {
      return currentValue;
    }
    currentCycle += cycleTime;
    if (instruction.operation === "addx") {
      currentValue += instruction.value;
    }
  }
  return currentValue;
}

function renderPixels(instructions: Array<Instruction>, screenWidth: number) {
  let spritePosition = [1, 3] as [number, number];
  let currentValue = 1;
  let currentCycle = 1;
  const crt: string[] = [];
  for (const instruction of instructions) {
    const cycles = OPERATION_CYCLE_MAP[instruction.operation];
    range(0, cycles).forEach(() => {
      crt.push(renderPixel(spritePosition, currentCycle));
      currentCycle = (currentCycle + 1) % screenWidth;
    });
    if (instruction.operation === "addx") {
      currentValue += instruction.value;
      spritePosition = [currentValue, currentValue + 2];
    }
  }
  return crt;
}

function renderPixel(spritePosition: [number, number], currentValue: number) {
  if (spritePosition[0] <= currentValue && spritePosition[1] >= currentValue) {
    return "#";
  } else {
    return ".";
  }
}

function drawResult(crt: Array<string>, screenWidth: number) {
  return crt.reduce((acc, pixel, index) => {
    if (index % screenWidth === 0) {
      acc += "\n";
    }
    acc += pixel;
    return acc;
  }, "");
}
