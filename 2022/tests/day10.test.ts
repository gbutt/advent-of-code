/**
 * This version solves the puzzle using generator functions a state machine to run the instruction cycles
 */
import fs from "fs/promises";
import { sum } from "./helpers";

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
  cycles: number;
}
interface AddXInstruction {
  operation: "addx";
  cycles: number;
  value: number;
}
type Instruction = NoopInstruction | AddXInstruction;

interface CycleValue {
  cycle: number;
  value: number;
}

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
    const result = sumSignalStrengths(instructions);
    expect(result).toBe(13140);
  });

  it("Part 1", () => {
    const instructions = parseInstructions(input);
    expect(sumSignalStrengths(instructions)).toBe(13820);
  });

  it("Part 2 - Example", () => {
    const instructions = parseInstructions(EXAMPLE_INPUT1);
    const screenWidth = 40;
    const result = drawPixels(instructions, screenWidth);

    expect(result).toBe(
      // prettier-ignore
      "##..##..##..##..##..##..##..##..##..##..\n" + 
      "###...###...###...###...###...###...###.\n" + 
      "####....####....####....####....####....\n" + 
      "#####.....#####.....#####.....#####.....\n" + 
      "######......######......######......###.\n" + 
      "#######.......#######.......#######....."
    );
  });
  it("Part 2", () => {
    const instructions = parseInstructions(input);
    const screenWidth = 40;
    const result = drawPixels(instructions, screenWidth);
    expect(result).toBe(
      // prettier-ignore
      "####.#..#..##..###..#..#..##..###..#..#.\n" +
      "...#.#.#..#..#.#..#.#.#..#..#.#..#.#.#..\n" +
      "..#..##...#....#..#.##...#....#..#.##...\n" +
      ".#...#.#..#.##.###..#.#..#.##.###..#.#..\n" +
      "#....#.#..#..#.#.#..#.#..#..#.#.#..#.#..\n" +
      "####.#..#..###.#..#.#..#..###.#..#.#..#."
    );
  });
});

function parseInstructions(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .map((line) => {
      const parts = line.split(" ");
      const operation = parts[0] as keyof typeof OPERATION_CYCLE_MAP;
      const value = parts.length > 1 && parseInt(parts[1], 10);
      const cycles = OPERATION_CYCLE_MAP[operation];
      return {
        operation,
        value,
        cycles,
      } as Instruction;
    });
}

/**
 * Collects the cycle values at startCycle and every step cycles after until after stopCycle.
 * @returns sum of calculated signal strengths of all collected cycles.
 */
function sumSignalStrengths(
  instructions: Array<Instruction>,
  startCycle = 20,
  stopCycle = 220,
  step = 40
) {
  const yieldedCycles: CycleValue[] = [];
  for (const cycleValue of runAllInstructions(instructions)) {
    if (shouldYield(cycleValue.cycle)) {
      yieldedCycles.push(cycleValue);
    }
    if (cycleValue.cycle === stopCycle) {
      break;
    }
  }
  return sum(...yieldedCycles.map((x) => x.cycle * x.value));

  /** yields at startCycle and every step cycles after */
  function shouldYield(cycle: number) {
    // suppress yields before we reach startCycle
    if (cycle < startCycle) {
      return false;
    }
    return (cycle - startCycle) % step === 0;
  }
}

/**
 * Renders a pixel value for each cycle.
 * Concatenates pixels into a frame.
 */
function drawPixels(instructions: Array<Instruction>, screenWidth: number) {
  let result = "";
  for (const { value, cycle } of runAllInstructions(instructions)) {
    const spritePosition = [value, value + 2] as const;
    const pixelPosition = cycle % screenWidth;
    const pixel = renderPixel(spritePosition, pixelPosition);
    result += (cycle > screenWidth && pixelPosition === 1 ? "\n" : "") + pixel;
  }
  return result;

  /** returns "#" if the sprite's range overlaps with the pixel, otherwise returns "." */
  function renderPixel(
    spritePosition: readonly [number, number],
    pixelPosition: number
  ) {
    return pixelPosition >= spritePosition[0] &&
      pixelPosition <= spritePosition[1]
      ? "#"
      : ".";
  }
}

/**
 * Generator function that builds a state manchine and cycles until all instructions are consumed.
 * @yields every cycle it will yield a CycleValue
 */
function* runAllInstructions(instructions: Array<Instruction>) {
  const startValue = 1;
  const stateMachine = new InstructionCycleStateMachine(
    instructions,
    startValue
  );
  while (stateMachine.hasInstructions()) {
    yield stateMachine.runCycle();
  }
}

class InstructionCycleStateMachine {
  #instructions: Array<Instruction>;
  #value: number;
  #cycle: number;
  #currentInstruction: Instruction | null;
  #instructionPointer: number;
  #currentInstructionCycle: number;

  constructor(instructions: Array<Instruction>, startValue: number) {
    this.#instructions = instructions;
    this.#value = startValue;
    this.#cycle = 0;
    this.#currentInstruction = null;
    this.#instructionPointer = 0;
    this.#currentInstructionCycle = 0;
  }

  hasInstructions() {
    return this.#instructionPointer < this.#instructions.length;
  }

  runCycle(): CycleValue {
    this.#cycleInstruction();
    if (this.#currentInstruction === null) {
      const currentInstruction = this.#instructions[this.#instructionPointer];
      this.#instructionPointer++;
      this.#startInstruction(currentInstruction);
    }
    this.#cycle++;
    return {
      cycle: this.#cycle,
      value: this.#value,
    };
  }

  #cycleInstruction() {
    const instruction = this.#currentInstruction;
    if (instruction === null) {
      return;
    }

    this.#currentInstructionCycle++;
    if (this.#currentInstructionCycle === instruction.cycles) {
      this.#finishInstruction(instruction);
    }
  }

  #startInstruction(instruction: Instruction) {
    if (!instruction) {
      return;
    }
    this.#currentInstruction = instruction;
    this.#currentInstructionCycle = 0;
  }

  #finishInstruction(instruction: Instruction) {
    if (instruction.operation === "addx") {
      this.#value += instruction.value;
    }
    this.#currentInstruction = null;
    this.#currentInstructionCycle = 0;
  }
}
