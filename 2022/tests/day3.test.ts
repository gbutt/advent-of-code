import fs from "fs/promises";
import { sum } from "./helpers";

const GROUP_SIZE = 3;
const EXAMPLE_INPUT = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

interface CompartmentDuplicateAnalysis {
  compartments: [string, string];
  duplicateItemType: string;
  duplicateItemPriority: number;
}

interface GroupBadgeAnalysis {
  groupRucksacks: [string, string, string];
  groupBadgeItemType: string;
  groupBadgeItemPriority: number;
}

// https://adventofcode.com/2022/day/3
describe("Day 3 - Rucksack Reorganization", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day3.input")).toString();
  });

  it("Part 1 - Example", () => {
    const result = determineCompartmentDuplicates(EXAMPLE_INPUT);
    const resultSum = sum(...result.map((x) => x.duplicateItemPriority));
    expect(resultSum).toBe(157);
  });

  it("Part 1", () => {
    const result = determineCompartmentDuplicates(input);
    const resultSum = sum(...result.map((x) => x.duplicateItemPriority));
    expect(resultSum).toBe(8109);
  });

  it("Part 2 - Example", () => {
    const result = determineGroupBadges(EXAMPLE_INPUT);
    const resultSum = sum(...result.map((x) => x.groupBadgeItemPriority));
    expect(resultSum).toBe(70);
  });

  it("Part 2", () => {
    const result = determineGroupBadges(input);
    const resultSum = sum(...result.map((x) => x.groupBadgeItemPriority));
    expect(resultSum).toBe(2738);
  });
});

function determineCompartmentDuplicates(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .reduce((acc, rucksackInventory) => {
      const stats = {} as CompartmentDuplicateAnalysis;
      const rucksackInventoryLength = rucksackInventory.length;
      const compartmentA = rucksackInventory.slice(
        0,
        rucksackInventoryLength / 2
      );
      const compartmentB = rucksackInventory.slice(rucksackInventoryLength / 2);
      stats.compartments = [compartmentA, compartmentB];
      const setA = compartmentA.split("");
      const setB = compartmentB.split("");
      const intersection = setA.filter((x) => setB.includes(x));
      stats.duplicateItemType = intersection[0];
      stats.duplicateItemPriority = determineItemPriority(
        stats.duplicateItemType
      );
      acc.push(stats);
      return acc;
    }, [] as Array<CompartmentDuplicateAnalysis>);
}

function determineGroupBadges(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .reduce((acc, rucksackInventory, currentIndex) => {
      let stats: GroupBadgeAnalysis;
      // determine if we need to create a new group or add to the existing group
      if (currentIndex % GROUP_SIZE === 0) {
        stats = {
          groupRucksacks: [] as Partial<GroupBadgeAnalysis["groupRucksacks"]>,
        } as GroupBadgeAnalysis;
        acc.push(stats);
      } else {
        stats = acc[acc.length - 1];
      }
      stats.groupRucksacks.push(rucksackInventory);

      // compile stats once group is complete
      if (stats.groupRucksacks.length === GROUP_SIZE) {
        // determine badge
        const setA = stats.groupRucksacks[0].split("");
        const setB = stats.groupRucksacks[1].split("");
        const setC = stats.groupRucksacks[2].split("");
        const intersection = [...setA].filter(
          (x) => setB.includes(x) && setC.includes(x)
        );
        stats.groupBadgeItemType = intersection[0];
        stats.groupBadgeItemPriority = determineItemPriority(
          stats.groupBadgeItemType
        );
      }

      return acc;
    }, [] as Array<GroupBadgeAnalysis>);
}

function determineItemPriority(itemType: string) {
  const charCode = itemType.charCodeAt(0);
  if (charCode > 96 && charCode < 123) {
    // char codes a - z have values 97 - 122
    // item types a - z have priorities 1 - 26
    return charCode - 96;
  } else if (charCode > 64 && charCode < 91) {
    // char codes A - Z have values 65 - 90
    // item types A - Z have priorities 27 - 52
    return charCode - 38;
  }
  throw `Unknown itemType ${itemType}`;
}
