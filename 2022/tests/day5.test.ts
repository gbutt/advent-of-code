import fs from "fs/promises";
import { range } from "./helpers";

const EXAMPLE_INPUT = `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

type Step = [number, number, number];
type Stack = Array<string>;
interface Configuraton {
  stacks: Array<Stack>;
  steps: Array<Step>;
}

// https://adventofcode.com/2022/day/5
describe("Day 5 - Supply Stacks", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day5.input")).toString();
  });

  it("Part 1 - Example", () => {
    const { stacks, steps } = parseConfiguration(EXAMPLE_INPUT);
    steps.forEach((step) => moveCrates9000(step, stacks));
    const result = selectTopCrates(stacks);
    expect(result).toBe("CMZ");
  });

  it("Part 1", () => {
    const { stacks, steps } = parseConfiguration(input);
    steps.forEach((step) => moveCrates9000(step, stacks));
    const result = selectTopCrates(stacks);
    expect(result).toBe("PTWLTDSJV");
  });

  it("Part 2 - Example", () => {
    const { stacks, steps } = parseConfiguration(EXAMPLE_INPUT);
    steps.forEach((step) => moveCrates9001(step, stacks));
    const result = selectTopCrates(stacks);
    expect(result).toBe("MCD");
  });

  it("Part 2", () => {
    const { stacks, steps } = parseConfiguration(input);
    steps.forEach((step) => moveCrates9001(step, stacks));
    const result = selectTopCrates(stacks);
    expect(result).toBe("WZMFVGGZP");
  });
});

function parseConfiguration(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .reduce(
      (acc, line) => {
        if (isStep(line)) {
          // parse steps
          const step = parseStep(line);
          acc.steps.push(step);
        } else {
          // parse stacks
          const stackRow = parseStackRow(line);
          assignStackRow(acc.stacks, stackRow);
        }
        return acc;
      },
      { stacks: [], steps: [] } as Configuraton
    );

  function isStep(line: string) {
    return line.startsWith("move");
  }

  function parseStep(line: string): Step {
    const [, matchQuantity, matchSourceStack, matchTargetStack] = line.match(
      /move (\d{1,}) from (\d{1,}) to (\d{1,})/
    ) as RegExpMatchArray;
    return [
      parseInt(matchQuantity, 10),
      parseInt(matchSourceStack, 10) - 1,
      parseInt(matchTargetStack, 10) - 1,
    ];
  }

  function parseStackRow(line: string) {
    const stackRow = [];
    const numOfStacks = (line.length + 1) / 4;
    for (let iterator = 0; iterator < numOfStacks; iterator++) {
      const offset = iterator * 4;
      const crate = line.substring(offset, offset + 3).trim();
      if (isValidCrate(crate)) {
        stackRow.push(crate.substring(1, 2));
      } else {
        stackRow.push(null);
      }
    }
    return stackRow;
  }

  function isValidCrate(crate: string) {
    return crate.startsWith("[");
  }

  function assignStackRow(
    stacks: Array<Stack>,
    stackRow: Array<string | null>
  ) {
    if (stacks.length === 0) {
      stackRow.forEach(() => {
        stacks.push([]);
      });
    }
    stackRow.forEach((stackItem, index) => {
      if (stackItem) {
        stacks[index].unshift(stackItem);
      }
    });
  }
}

function moveCrates9000(
  [quantity, sourceStack, targetStack]: Step,
  stacks: Array<Stack>
) {
  if (stacks[sourceStack].length < quantity) {
    throw `stack ${sourceStack} doesn't have ${quantity} crates to move`;
  }
  range(0, quantity).forEach(() => {
    const crate = stacks[sourceStack].pop() as string;
    stacks[targetStack].push(crate);
  });
}

function moveCrates9001(
  [quantity, sourceStack, targetStack]: Step,
  stacks: Array<Stack>
) {
  if (stacks[sourceStack].length < quantity) {
    throw `stack ${sourceStack} doesn't have ${quantity} crates to move`;
  }
  const crates = stacks[sourceStack].splice(
    stacks[sourceStack].length - quantity
  );
  stacks[targetStack].push(...crates);
}

function selectTopCrates(stacks: Array<Stack>) {
  return stacks.reduce((acc, stack) => acc + stack[stack.length - 1], "");
}
