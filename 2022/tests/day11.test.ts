import fs from "fs/promises";
import { range } from "./helpers";

const EXAMPLE_INPUT1 = `
Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1
`;

// https://adventofcode.com/2022/day/11
describe("Day 11 - Monkey in the Middle", () => {
  let input: string;
  beforeAll(async () => {
    input = (await fs.readFile("tests/inputs/day11.input")).toString().trim();
  });

  it("Part 1 - Example", () => {
    const monkeys = parseMonkeys(EXAMPLE_INPUT1);
    const result = calculateMonkeyBusinessScore(monkeys, 20, 3);
    expect(result).toBe(10605);
  });

  it("Part 1", () => {
    const monkeys = parseMonkeys(input);
    const result = calculateMonkeyBusinessScore(monkeys, 20, 3);
    expect(result).toBe(112221);
  });

  it("Part 2 - Example", () => {
    const monkeys = parseMonkeys(EXAMPLE_INPUT1);
    const result = calculateMonkeyBusinessScore(monkeys, 10000, 1);
    expect(result).toBe(2713310158);
  });

  it("Part 2", () => {
    const monkeys = parseMonkeys(input);
    const result = calculateMonkeyBusinessScore(monkeys, 10000, 1);
    expect(result).toBe(25272176808);
  });
});

const monkeyRegex = /Monkey (\d{1,}:)/;
const startingItemRegex = /Starting items: (.*)/;
const operationRegex = /Operation: new = (.*)/;
const testRegex = /Test: divisible by (.*)/;
const testTrueRegex = /If true: throw to monkey (.*)/;
const testFalseRegex = /If false: throw to monkey (.*)/;

function parseMonkeys(input: string) {
  return input
    .split("\n")
    .filter((line) => !!line)
    .reduce<Monkey[]>((monkeys, line) => {
      const monkeyMatch = line.match(monkeyRegex);
      if (monkeyMatch) {
        const newMonkey = new Monkey(parseInt(monkeyMatch[1], 10));
        monkeys.push(newMonkey);
      } else {
        const monkey = monkeys[monkeys.length - 1];
        const startingItemMatch = line.match(startingItemRegex);
        const operationMatch = line.match(operationRegex);
        const testMatch = line.match(testRegex);
        const testTrueMatch = line.match(testTrueRegex);
        const testFalseMatch = line.match(testFalseRegex);
        if (startingItemMatch) {
          monkey.itemQueue = startingItemMatch[1]
            .split(",")
            .map((x) => parseInt(x.trim(), 10))
            .map((x) => new Item(x));
        } else if (operationMatch) {
          const operationStr = operationMatch[1];
          const parts = operationStr.split(" ");
          const operator = parts[1];
          if (operator !== "+" && operator !== "*") {
            throw `unknown operator ${operator}`;
          }
          monkey.inspectionOperator = operator;
          monkey.inspectionOperand =
            parts[2] === "old" ? "old" : parseInt(parts[2], 10);
        } else if (testMatch) {
          monkey.testDivisor = parseInt(testMatch[1], 10);
        } else if (testTrueMatch) {
          monkey.testTrue = parseInt(testTrueMatch[1], 10);
        } else if (testFalseMatch) {
          monkey.testFalse = parseInt(testFalseMatch[1], 10);
        }
      }
      return monkeys;
    }, []);
}

function calculateMonkeyBusinessScore(
  monkeys: Monkey[],
  rounds = 20,
  worryDivisor = 3
) {
  const stats = calculateMostActiveMonkeyInspections(
    monkeys,
    rounds,
    worryDivisor
  );
  const sortedValues = Object.values(stats).sort((a, b) => b - a);
  return sortedValues[0] * sortedValues[1];
}

function calculateMostActiveMonkeyInspections(
  monkeys: Monkey[],
  rounds: number,
  worryDivisor: number
) {
  const stateMachine = new MonkeyTossStateMachine(monkeys, worryDivisor);

  const stats = range(1, rounds).reduce<{ [monkeyId: string]: number }>(
    (monkeyActivity, round) => {
      const roundStats = [...stateMachine.runRound()].reduce<{
        [monkeyId: string]: number;
      }>((monkeyActivity, inspection) => {
        const monkeyId = `${inspection.monkeyId}`;
        if (!monkeyActivity[monkeyId]) {
          monkeyActivity[monkeyId] = 0;
        }
        monkeyActivity[monkeyId]++;
        return monkeyActivity;
      }, {});
      Object.keys(roundStats).forEach(
        (monkeyId) =>
          (monkeyActivity[monkeyId] =
            (monkeyActivity[monkeyId] || 0) + (roundStats[monkeyId] || 0))
      );
      return monkeyActivity;
    },
    {}
  );
  return stats;
}

type Operator = "+" | "*";
interface ItemOperation {
  operator: Operator;
  operand: number | "old";
}

class Item {
  rootWorry: number;
  operations: ItemOperation[];

  constructor(worry: number) {
    this.rootWorry = worry;
    this.operations = [];
  }

  increaseWorry(operator: Operator, operand: number | "old") {
    this.operations.push({
      operator,
      operand,
    });
  }

  isDivisibleBy(divisor: number) {
    let leftOperand = this.rootWorry % divisor;
    for (const { operator, operand } of this.operations) {
      const rightOperand = typeof operand === "number" ? operand : leftOperand;
      if (operator === "+") {
        leftOperand = (leftOperand + rightOperand) % divisor;
      } else if (operator === "*") {
        leftOperand = (leftOperand * rightOperand) % divisor;
      }
    }
    return leftOperand === 0;
  }

  reduceWorry(worryDivisor: number) {
    let operation = this.operations.shift();
    let worry = this.rootWorry;
    while (operation) {
      const { operator, operand } = operation;
      const operandWorry = typeof operand === "number" ? operand : worry;
      if (operator === "+") {
        worry += operandWorry;
      } else if (operator === "*") {
        worry *= operandWorry;
      }
      worry = Math.floor(worry / worryDivisor);
      operation = this.operations.shift();
    }
    this.rootWorry = worry;
  }

  calculateTotalWorry() {
    let worry = this.rootWorry;
    for (const { operator, operand } of this.operations) {
      const operandWorry = operand === "old" ? worry : operand;
      if (operator === "+") {
        worry += operandWorry;
      } else if (operator === "*") {
        worry *= operandWorry;
      }
    }
    return worry;
  }
}

class Monkey {
  id: number;
  itemQueue: Item[];

  inspectionOperator?: Operator;
  inspectionOperand?: number | "old";
  testDivisor?: number;
  testTrue?: number;
  testFalse?: number;

  constructor(id: number) {
    this.id = id;
    this.itemQueue = [];
  }

  inspect(item: Item) {
    if (!this.inspectionOperator || !this.inspectionOperand) {
      throw `invalid operation: operator: ${this.inspectionOperator}, operand: ${this.inspectionOperand}`;
    }

    const operand = this.inspectionOperand;
    item.increaseWorry(this.inspectionOperator, operand);
  }

  test(item: Item) {
    if (
      !this.testDivisor ||
      this.testTrue === undefined ||
      this.testFalse === undefined
    ) {
      throw `invalid test: testDivisor: ${this.testDivisor}, testTrue: ${this.testTrue}, testFalse: ${this.testFalse}`;
    }

    return item.isDivisibleBy(this.testDivisor)
      ? this.testTrue
      : this.testFalse;
  }
}

class MonkeyTossStateMachine {
  monkeys: Monkey[];
  worryDivisor: number;
  round: number;

  constructor(monkeys: Monkey[], worryDivisor: number) {
    this.monkeys = monkeys;
    this.worryDivisor = worryDivisor;
    this.round = 0;
  }

  *runRound() {
    this.round++;
    for (let idx = 0; idx < this.monkeys.length; idx++) {
      const monkey = this.monkeys[idx];
      let item = monkey.itemQueue.shift();
      while (item) {
        yield { monkeyId: monkey.id };
        monkey.inspect(item);
        if (this.worryDivisor > 1) {
          item.reduceWorry(this.worryDivisor);
        }
        const newMonkeyId = monkey.test(item);
        this.monkeys[newMonkeyId].itemQueue.push(item);
        // if (this.round === 5 && idx === 0) {
        //   console.log({
        //     idx,
        //     newMonkeyId,
        //     worry: item.calculateTotalWorry(),
        //     worryModuleOperand: item.calculateModuloOperand(23),
        //     rootWorry: item.rootWorry,
        //     operations: item.operations.map(({operator, operand}) => ({operator, operand: operand.calculateTotalWorry()}))
        //   });
        // }

        item = monkey.itemQueue.shift();
      }
    }
  }
}
