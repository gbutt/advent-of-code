// read the input file
const fs = require("fs");
const input = fs.readFileSync("tests/test_day2.txt", "utf8");
const numbers = input
  .split("\n")
  .filter((line) => line)
  .map((line) => line.split(" ").map(Number));

// count the number of safe sequences
let safeSequences = 0;
const unsafeSequences = [];
for (const sequence of numbers) {
  if (isSafeSequence(sequence)) {
    safeSequences++;
  } else {
    unsafeSequences.push(sequence);
  }
}

console.log("Answer Part 1: " + safeSequences);

// count the number of safe sequences with dampening
let safeSequencesWithDampening = 0;
for (const sequence of unsafeSequences) {
  if (isSafeSequenceWithDampening(sequence)) {
    safeSequencesWithDampening++;
  }
}

console.log("Answer Part 2: " + (safeSequences + safeSequencesWithDampening));

// check if a sequence is safe
// a sequence is safe if:
// 1. the numbers are in ascending or descending order
// 2. the absolute difference between each number and the next is between 1 and 3
function isSafeSequence(sequence) {
  let [previous, ...rest] = sequence;
  let direction;
  for (const current of rest) {
    if (direction == null) {
      direction = Math.sign(current - previous);
    }
    if (!areSafePairs(previous, current, direction)) {
      return false;
    }
    previous = current;
  }

  return true;
}

// check if a sequence is safe with dampening
// a sequence is safe with dampening if:
// 1. it is already safe, or
// 2. removing one number makes it safe
function isSafeSequenceWithDampening(sequence) {
  // try removing each number and check if sequence becomes safe
  for (let i = 0; i < sequence.length; i++) {
    const newSequence = sequence.slice(0, i).concat(sequence.slice(i + 1));
    if (isSafeSequence(newSequence)) {
      return true;
    }
  }

  return false;
}

function areSafePairs(first, second, direction) {
  const diff = second - first;
  const newDirection = Math.sign(diff);
  return newDirection === direction && isInRange(diff);
}

function isInRange(number) {
  return Math.abs(number) >= 1 && Math.abs(number) <= 3;
}
