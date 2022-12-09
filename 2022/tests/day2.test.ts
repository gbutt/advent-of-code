import fs from "fs/promises";

const EXAMPLE_INPUT = `A Y
B X
C Z
`;

enum Shape {
  "A" = 1,
  "B",
  "C",
}
type Column1Type = "A" | "B" | "C";
type Column2Type = "X" | "Y" | "Z";

// https://adventofcode.com/2022/day/2
describe("Day 2 - Rock Paper Scissors", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day2.input")).toString();
  });

  it("Part 1 - Example", () => {
    const shapePairs = parseShapePairs(EXAMPLE_INPUT, myShapeStrategyPart1);
    const myTotalScore = determineTotalScore(shapePairs);
    expect(myTotalScore).toBe(15);
  });

  it("Part 1", () => {
    const shapePairs = parseShapePairs(input, myShapeStrategyPart1);
    const myTotalScore = determineTotalScore(shapePairs);
    expect(myTotalScore).toBe(10595);
  });

  it("Part 2 - Example", () => {
    const shapePairs = parseShapePairs(EXAMPLE_INPUT, myShapeStrategyPart2);
    const myTotalScore = determineTotalScore(shapePairs);
    expect(myTotalScore).toBe(12);
  });

  it("Part 2", () => {
    const shapePairs = parseShapePairs(input, myShapeStrategyPart2);
    const myTotalScore = determineTotalScore(shapePairs);
    expect(myTotalScore).toBe(9541);
  });
});

function parseShapePairs(
  input: string,
  myShapeStrategy: (shape1: Shape, column2: Column2Type) => Shape
) {
  return input.split("\n").reduce((shapePairs, currentPair) => {
    if (currentPair) {
      const [theirShapeType, column2] = currentPair.split(" ") as [
        Column1Type,
        Column2Type
      ];
      const theirShape = Shape[theirShapeType];
      const myShape = myShapeStrategy(theirShape, column2);
      shapePairs.push([theirShape, myShape]);
    }
    return shapePairs;
  }, [] as Array<[Shape, Shape]>);
}

function myShapeStrategyPart1(
  _theirShape: Shape,
  myShapeType: Column2Type
): Shape {
  switch (myShapeType) {
    case "X":
      return Shape.A;
    case "Y":
      return Shape.B;
    case "Z":
      return Shape.C;
    default:
      throw `Unknown myShapeType ${myShapeType}`;
  }
}

function myShapeStrategyPart2(
  theirShape: Shape,
  desiredOutcome: Column2Type
): Shape {
  switch (desiredOutcome) {
    case "X": // lose - 1=>3, 2=>1, 3=>2
      return ((theirShape - 1) % 3 || 3) as Shape;
    case "Y": // draw - 1=>1, 2=>2, 3=>3
      return theirShape;
    case "Z": // win - 1=>2, 2=>3, 3=>1
      return ((theirShape + 1) % 3 || 3) as Shape;
    default:
      throw `Unknown desiredOutcome ${desiredOutcome}`;
  }
}

function determineTotalScore(shapePairs: Array<[Shape, Shape]>) {
  return shapePairs.reduce((myTotalScore, [theirShape, myShape]) => {
    const myOutcomeScore = determineOutcomeScore(theirShape, myShape);
    const myScoreThisHand = myShape + myOutcomeScore;
    myTotalScore += myScoreThisHand;
    return myTotalScore;
  }, 0);
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
