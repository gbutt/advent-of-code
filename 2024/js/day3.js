// read the input file
const fs = require("fs");
const input = fs.readFileSync("tests/test_day3.txt", "utf8");

// sum up the result all the mul(x,y) expressions
const result1 = findMul(input).reduce((acc, match) => {
  return acc + mul(match);
}, 0);

console.log("Answer Part 1:", result1);

// find all mul expressions not preceded by a don't() expression
// and sum up the result
let startIndex = 0;
let stopIndex = input.indexOf("don't()");
let result2 = 0;
while (startIndex > -1) {
  const matches = findMul(input.slice(startIndex, stopIndex));
  result2 +=
    matches?.reduce((acc, match) => {
      return acc + mul(match);
    }, 0) ?? 0;

  const newStartIndex = input.slice(stopIndex + 1).indexOf("do()");
  if (newStartIndex === -1) {
    break;
  }
  startIndex = stopIndex + 1 + newStartIndex;

  const newStopIndex = input.slice(startIndex).indexOf("don't()");
  if (newStopIndex === -1) {
    stopIndex = input.length;
  } else {
    stopIndex = startIndex + newStopIndex;
  }
}

console.log("Answer Part 2:", result2);

// use a regex to find all the mul(x,y) expressions
const findMulRegex = /mul\((\d+),(\d+)\)/g;
function findMul(input) {
  return input.match(findMulRegex);
}

// use a regex to parse the mul(x,y) expression
// and return the product of x and y
const parseMulRegex = /mul\((\d+),(\d+)\)/;
function mul(input) {
  const [_, x, y] = input.match(parseMulRegex);
  return x * y;
}
