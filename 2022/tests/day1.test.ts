import fs from "fs/promises";
import { sum } from "./helpers";

const EXAMPLE_INPUT = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

// https://adventofcode.com/2022/day/1
describe("Day 1 - Calorie Counting", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day1.input")).toString();
  });

  it("Part 1 - Example", () => {
    const maxCalories = determineMaxCalories(EXAMPLE_INPUT);
    expect(maxCalories).toBe(24000);
  });

  it("Part 1", () => {
    const maxCalories = determineMaxCalories(input);
    expect(maxCalories).toBe(68787);
  });

  it("Part 2 - Example", () => {
    const maxCalories = determineMaxCalories(EXAMPLE_INPUT, 3);
    expect(maxCalories).toBe(45000);
  });

  it("Part 2", () => {
    const maxCalories = determineMaxCalories(input, 3);
    expect(maxCalories).toBe(198041);
  });
});

function determineMaxCalories(input: string, top = 1) {
  const elfCalorieList = parseCalories(input);
  const sortedCalories = sortCaloriesDesc(elfCalorieList);
  return sum(...sortedCalories.slice(0, top));
}

function parseCalories(input: string) {
  return input.split("\n").reduce(
    (acc, calorieStr) => {
      if (calorieStr) {
        acc[acc.length - 1] += parseInt(calorieStr, 10);
      } else {
        acc.push(0);
      }
      return acc;
    },
    [0]
  );
}

function sortCaloriesDesc(calorieList: Array<number>) {
  return [...calorieList].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
}
