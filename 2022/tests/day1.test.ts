import fs from "fs/promises";

// https://adventofcode.com/2022/day/1
describe("Day 1 - Calorie Counting", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day1.input")).toString();
  });
  it("Example", () => {
    const { maxCalories, topThreeCalories } = findMaxCalories(exampleInput);
    expect(maxCalories).toBe(24000);
    expect(topThreeCalories).toBe(45000);
  });

  it("Part 1", () => {
    const { maxCalories } = findMaxCalories(input);
    expect(maxCalories).toBe(68787);
  });

  it("Part 2", () => {
    const { topThreeCalories } = findMaxCalories(input);
    expect(topThreeCalories).toBe(198041);
  });
});

function findMaxCalories(input: string) {
  const elfCalorieList = input.split("\n").reduce(
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

  const sortedCalories = [...elfCalorieList].sort((a, b) =>
    a > b ? -1 : a < b ? 1 : 0
  );

  const maxCalories = sortedCalories[0];
  const topThreeCalories = sortedCalories
    .slice(0, 3)
    .reduce((sum, calories) => sum + calories, 0);
  return { maxCalories, topThreeCalories };
}

const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
