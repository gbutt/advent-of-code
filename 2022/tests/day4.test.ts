import fs from "fs/promises";
import { range } from "./helpers";

const EXAMPLE_INPUT = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

// https://adventofcode.com/2022/day/4
describe("Day 4 - Camp Cleanup", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day4.input")).toString();
  });

  it("Part 1 - Example", () => {
    const result = determineFullyContainedPairs(EXAMPLE_INPUT);
    expect(result).toBe(2);
  });

  it("Part 1", () => {
    const result = determineFullyContainedPairs(input);
    expect(result).toBe(496);
  });

  it("Part 2 - Example", () => {
    const result = determineOverlappingPairs(EXAMPLE_INPUT);
    expect(result).toBe(4);
  });

  it("Part 2", () => {
    const result = determineOverlappingPairs(input);
    expect(result).toBe(847);
  });
});

function determineFullyContainedPairs(input: string) {
  return parseRangesFromInput(input).reduce((acc, [rangeA, rangeB]) => {
    const intersection = rangeA.filter((section) => rangeB.includes(section));
    if (rangeA.every((section) => intersection.includes(section))) {
      acc++;
    } else if (rangeB.every((section) => intersection.includes(section))) {
      acc++;
    }
    return acc;
  }, 0);
}

function determineOverlappingPairs(input: string) {
  return parseRangesFromInput(input).reduce((acc, [rangeA, rangeB]) => {
    if (rangeA.some((section) => rangeB.includes(section))) {
      acc++;
    }
    return acc;
  }, 0);
}

function parseRangesFromInput(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .reduce((acc, input) => {
      const pairs = input.split(",");
      const rangeA = parseRange(pairs[0]);
      const rangeB = parseRange(pairs[1]);
      acc.push([rangeA, rangeB]);
      return acc;
    }, [] as Array<[number[], number[]]>);
}

function parseRange(rangeInput: string) {
  const [startStr, endStr] = rangeInput.split("-");
  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  return range(start, end - start + 1);
}
