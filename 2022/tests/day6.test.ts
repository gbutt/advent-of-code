import fs from "fs/promises";
import { range } from "./helpers";

// https://adventofcode.com/2022/day/6
describe("Day 6 - Tuning Trouble", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day6.input")).toString().trim();
  });

  it("Part 1 - Examples", () => {
    expect(findMarkerEndPosition("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(7);
    expect(findMarkerEndPosition("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(5);
    expect(findMarkerEndPosition("nppdvjthqldpwncqszvftbrmjlhg")).toBe(6);
    expect(findMarkerEndPosition("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(10);
    expect(findMarkerEndPosition("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(11);
  });

  it("Part 1", () => {
    expect(findMarkerEndPosition(input)).toBe(1034);
  });

  it("Part 2 - Examples", () => {
    expect(findMarkerEndPosition("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14)).toBe(
      19
    );
    expect(findMarkerEndPosition("bvwbjplbgvbhsrlpgdmjqwftvncz", 14)).toBe(23);
    expect(findMarkerEndPosition("nppdvjthqldpwncqszvftbrmjlhg", 14)).toBe(23);
    expect(findMarkerEndPosition("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14)).toBe(
      26
    );
    expect(findMarkerEndPosition("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14)).toBe(
      29
    );
    expect(findMarkerEndPosition("nznrnfrfntjfmvfwmzdfjlvtqnbhc", 14)).toBe(29);
    expect(findMarkerEndPosition("nznrnfrfntjfmvfwmzdfjlvtqnbh", 14)).toBe(-1);
  });

  it("Part 2", () => {
    expect(findMarkerEndPosition(input, 14)).toBe(2472);
  });
});

function findMarkerEndPosition(input: string, markerLength = 4) {
  for (const markerStartPosition of range(0, input.length - markerLength + 1)) {
    const marker = input.substring(
      markerStartPosition,
      markerStartPosition + markerLength
    );
    // if all elements in the marker are unique
    if (new Set(marker).size === markerLength) {
      return markerStartPosition + markerLength;
    }
  }
  return -1;
}
