import fs from "fs/promises";

// https://adventofcode.com/2022/day/2
describe("Day 2 - Rock Paper Scissors", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day2.input")).toString();
  });

  it("Example - Part 1", () => {
    const shapePairs = parseShapePairsPart1(exampleInput);
    const stats = determineTotalScores(shapePairs);
    expect(stats.myTotalScore).toBe(15);
  });

  it("Part 1", () => {
    const shapePairs = parseShapePairsPart1(input);
    const stats = determineTotalScores(shapePairs);
    expect(stats.myTotalScore).toBe(10595);
  });

  it("Example - Part 2", () => {
    const shapePairs = parseShapePairsPart2(exampleInput);
    const stats = determineTotalScores(shapePairs);
    expect(stats.myTotalScore).toBe(12);
  });

  it("Part 2", () => {
    const shapePairs = parseShapePairsPart2(input);
    const stats = determineTotalScores(shapePairs);
    expect(stats.myTotalScore).toBe(9541);
  });
});

enum Shape {
  "A" = 1,
  "B",
  "C",
}
type ShapeKey = keyof typeof Shape;
type MyShapeKey = "X" | "Y" | "Z";
type DesiredOutcome = "X" | "Y" | "Z";

function parseShapePairsPart1(input: string) {
  return input.split("\n").reduce((shapePairs, currentPair) => {
    if (currentPair) {
      const [theirShapeKey, myShapeKey] = currentPair.split(" ") as [
        ShapeKey,
        MyShapeKey
      ];
      const theirShape = Shape[theirShapeKey];
      const myShape = determineShapeFromMyShapeKey(myShapeKey);
      shapePairs.push([theirShape, myShape]);
    }
    return shapePairs;
  }, [] as Array<[Shape, Shape]>);
}

function determineShapeFromMyShapeKey(myShapeKey: MyShapeKey) {
  switch (myShapeKey) {
    case "X":
      return Shape.A;
    case "Y":
      return Shape.B;
    case "Z":
      return Shape.C;
    default:
      throw `Unknown myShapeKey ${myShapeKey}`;
  }
}

function parseShapePairsPart2(input: string) {
  return input.split("\n").reduce((shapePairs, currentPair) => {
    if (currentPair) {
      const [theirShapeKey, desiredOutcome] = currentPair.split(" ") as [
        ShapeKey,
        DesiredOutcome
      ];
      const theirShape = Shape[theirShapeKey];
      const myShape = determineShapeFromDesiredOutcome(
        theirShape,
        desiredOutcome
      );
      shapePairs.push([theirShape, myShape]);
    }
    return shapePairs;
  }, [] as Array<[Shape, Shape]>);
}

function determineShapeFromDesiredOutcome(
  theirShape: Shape,
  desiredOutcome: DesiredOutcome
) {
  let myShape: Shape;
  switch (desiredOutcome) {
    case "X": // lose - 1=>3, 2=>1, 3=>2
      myShape = (theirShape - 1) % 3 || 3;
      break;
    case "Y": // draw - 1=>1, 2=>2, 3=>3
      myShape = theirShape;
      break;
    case "Z": // win - 1=>2, 2=>3, 3=>1
      myShape = (theirShape + 1) % 3 || 3;
      break;
    default:
      throw `Unknown desiredOutcome ${desiredOutcome}`;
  }
  return myShape;
}

function determineTotalScores(shapePairs: Array<[Shape, Shape]>) {
  return shapePairs.reduce(
    (stats, [theirShape, myShape]) => {
      const myOutcomeScore = determineOutcomeScore(theirShape, myShape);
      stats.myTotalScore += myShape + myOutcomeScore;
      const theirOutcomeScore = determineOutcomeScore(myShape, theirShape);
      stats.theirTotalScore += theirShape + theirOutcomeScore;
      return stats;
    },
    { myTotalScore: 0, theirTotalScore: 0 }
  );
}

function determineOutcomeScore(theirShape: Shape, myShape: Shape) {
  const outcome = (myShape - theirShape + 3) % 3;
  switch (outcome) {
    case 0: // tie
      return 3;
    case 1: // win
      return 6;
    case 2: // lose
      return 0;
    default:
      throw `Unrecognized input: ${theirShape} ${myShape} ${outcome}`;
  }
}

const exampleInput = `A Y
B X
C Z
`;
