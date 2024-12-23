const fs = require("fs");

// read the input file
const input = fs.readFileSync("inputs/day3.txt", "utf8");

// convert the input into a matrix
const matrix = input
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(""));

// for each line, find the first index of each sequence of digits, and place it into a tuple with the digits
const answerPart1 = matrix
  .map((line, lineIndex) => {
    const lineString = line.join("");
    const digits = lineString.match(/\d+/g);
    if (!digits) {
      return 0;
    }
    const digitPositions = digits.map((digitString) => {
      const firstDigitIndex = lineString.indexOf(digitString);
      return [digitString, firstDigitIndex];
    });

    return digitPositions.reduce((acc, [digitString, digitIndex]) => {
      if (isPartNumber(digitString.length, digitIndex, lineIndex, matrix)) {
        console.log({ digitString, digitIndex, lineIndex });
        return acc + parseInt(digitString);
      }
      return acc;
    }, 0);
  })
  .reduce((acc, digit) => acc + digit, 0);

console.log("Answer Part 1:", answerPart1);

function isPartNumber(digitLength, firstDigitIndex, lineIndex, matrix) {
  const lastDigitIndex = firstDigitIndex + digitLength - 1;
  const coordinatesToCheck = [];

  if (firstDigitIndex > 0) {
    coordinatesToCheck.push([lineIndex, firstDigitIndex - 1]);
    if (lineIndex > 0) {
      coordinatesToCheck.push([lineIndex - 1, firstDigitIndex - 1]);
    }
    if (lineIndex + 1 < matrix.length) {
      coordinatesToCheck.push([lineIndex + 1, firstDigitIndex - 1]);
    }
  }

  if (lastDigitIndex + 1 < matrix[lineIndex].length) {
    coordinatesToCheck.push([lineIndex, lastDigitIndex + 1]);
    if (lineIndex > 0) {
      coordinatesToCheck.push([lineIndex - 1, lastDigitIndex + 1]);
    }
    if (lineIndex + 1 < matrix.length) {
      coordinatesToCheck.push([lineIndex + 1, lastDigitIndex + 1]);
    }
  }

  for (let i = firstDigitIndex; i < lastDigitIndex + 1; i++) {
    if (lineIndex > 0) {
      coordinatesToCheck.push([lineIndex - 1, i]);
    }
    if (lineIndex + 1 < matrix.length) {
      coordinatesToCheck.push([lineIndex + 1, i]);
    }
  }

  return coordinatesToCheck.some(([rowIndex, colIndex]) =>
    matrix[rowIndex][colIndex]?.match(/[^\d\.]/)
  );
}
