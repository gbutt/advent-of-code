import fs from "fs/promises";

// https://adventofcode.com/2022/day/6
describe("Day 6 - Tuning Trouble", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day6.input")).toString().trim();
  });

  it("Part 1 - Examples", () => {
    expect(findMarkerPosition("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(7);
    expect(findMarkerPosition("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(5);
    expect(findMarkerPosition("nppdvjthqldpwncqszvftbrmjlhg")).toBe(6);
    expect(findMarkerPosition("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(10);
    expect(findMarkerPosition("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(11);
  });

  it("Part 1", () => {
    expect(findMarkerPosition(input)).toBe(1034);
  });

  it("Part 2 - Examples", () => {
    expect(findMarkerPosition("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14)).toBe(19);
    expect(findMarkerPosition("bvwbjplbgvbhsrlpgdmjqwftvncz", 14)).toBe(23);
    expect(findMarkerPosition("nppdvjthqldpwncqszvftbrmjlhg", 14)).toBe(23);
    expect(findMarkerPosition("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14)).toBe(
      29
    );
    expect(findMarkerPosition("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14)).toBe(26);
  });

  it("Part 2", () => {
    expect(findMarkerPosition(input, 14)).toBe(2472);
  });
});

function findMarkerPosition(input: string, markerSize = 4) {
  let markerPostion = markerSize;
  while (markerPostion < input.length) {
    const marker = input.substring(markerPostion - markerSize, markerPostion);
    if (new Set(marker).size === markerSize) {
      return markerPostion;
    }
    markerPostion++;
  }
  return markerPostion;
}
