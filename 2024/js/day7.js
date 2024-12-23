const fs = require("fs");
var input = `190: 10 19
156: 15 6
3267: 81 40 27 1`;
var input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim();

// var input = fs.readFileSync("./tests/test_day7.txt", "utf8").trim();

const equations = input.split("\n").map((line) => {
  const [[total], values] = line.split(": ").map(value => value.split(" ").map(Number));
  return {
    total,
    values
  };
});

var solvable = equations.filter(({ total, values }) => {
  // console.log({ total, values });
  let hasSolution = false;
  // there are n-1 operators
  const operatorCount = values.length - 1;
  // and there are 2^n-1 possible permutations of operators
  const maxPermutations = Math.pow(2, operatorCount);
  // for each permutation
  for (let i = 0; i < maxPermutations; i++) {
    // get the indices of the operators for this permutation
    const operatorIndices = [];
    for (let j = 0; j < operatorCount; j++) {
      if (i & (1 << j)) {
        operatorIndices.push(j + 1);
      }
    }
    // calculate the solution
    const solution = values.reduce((acc, num, valueIndex) => {
      if (operatorIndices.includes(valueIndex)) {
        return acc * num;
      }
      return acc + num;
    }, 0);
    // console.log(printSolution(values, operatorIndices), operatorIndices, solution, total);
    // check if solution is correct
    if (solution === total) {
      hasSolution = true;
      // console.log('found solution', printSolution(values, operatorIndices), { total, values });
      // for speed, we can quit at this point, but it's more interesting to find all solutions
      return true;
    }
  }
  return hasSolution;
});

console.log('Answer Part 1:', solvable.length, '/', equations.length, solvable.reduce((acc, { total }) => acc + total, 0));

// Part 2

var solvable = equations.filter(({ total, values }) => {
  // console.log({ total, values });
  let hasSolution = false;

  const operatorCount = values.length - 1;
  const maxPermutations = Math.pow(2, operatorCount);
  // for each permutation and operator
  for (let concatIndex = 0; concatIndex < maxPermutations; concatIndex++) {
    const concatOperatorIndices = [];
    for (let j = 0; j < operatorCount; j++) {
      if (concatIndex & (1 << j)) {
        concatOperatorIndices.push(j + 1);
      }
    }
    for (let multiplyIndex = 0; multiplyIndex < maxPermutations; multiplyIndex++) {
      // skip if both indices overlap, because this equation permutation would be a duplicate
      if (concatIndex > 0 && multiplyIndex > 0 && (concatIndex & multiplyIndex) > 0) {
        continue;
      }
      const multiplyOperatorIndices = [];
      for (let j = 0; j < operatorCount; j++) {
        if (multiplyIndex & (1 << j)) {
          multiplyOperatorIndices.push(j + 1);
        }
      }
      // calculate the solution using a peekhead strategy
      const solution = values.reduce((acc, num, valueIndex) => {
        if (valueIndex === values.length - 1) {
          return acc;
        }
        if (concatOperatorIndices.includes(valueIndex + 1)) {
          return parseInt(acc.toString() + values[valueIndex + 1].toString(), 10);
        } else if (multiplyOperatorIndices.includes(valueIndex + 1)) {
          return acc * values[valueIndex + 1];
        } else {
          return acc + values[valueIndex + 1];
        }
      }, values[0]);
      // console.log(printSolution(values, multiplyOperatorIndices, concatOperatorIndices));
      // check if solution is correct
      if (solution === total) {
        hasSolution = true;
        // console.log('found solution', printSolution(values, multiplyOperatorIndices, concatOperatorIndices), { total });
        // for speed, we can quit at this point, but it's more interesting to find all solutions
        return true;
      }
    }
  }
  return hasSolution;
});

console.log('Answer Part 2:', solvable.length, '/', equations.length, solvable.reduce((acc, { total }) => acc + total, 0));

function printSolution(values, multiplyOperatorIndices, concatOperatorIndices = []) {
  return values.reduce((acc, num, valueIndex) => {
    if (valueIndex === values.length - 1) {
      return acc;
    }
    if (concatOperatorIndices.includes(valueIndex + 1)) {
      return acc + ' || ' + values[valueIndex + 1].toString();
    } else if (multiplyOperatorIndices.includes(valueIndex + 1)) {
      return acc + ' * ' + values[valueIndex + 1].toString();
    } else {
      return acc + ' + ' + values[valueIndex + 1].toString();
    }
  }, values[0].toString());
}
