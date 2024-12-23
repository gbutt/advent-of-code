const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(
  path.join(__dirname, "../inputs/day1.txt"),
  "utf8"
);

let numbers = input.split("\n").map((line) => {
  // Find all single digits in the line
  const digits = line.match(/\d/g);

  if (!digits) {
    return 0; // Handle lines with no digits
  }

  // If only one digit found, use it for both first and last
  let firstDigit = digits[0];
  let lastDigit = digits[digits.length - 1];

  // Combine digits into a two-digit number
  return parseInt(firstDigit + lastDigit);
});

// Sum all the numbers
let result = numbers.reduce((sum, num) => sum + num, 0);
console.log("Answer Part 1:", result);

numbers = input.split("\n").map((line) => {
  // Find all single digits in the line
  const digits = [
    ...line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g),
  ].map((match) => match[1]);

  if (!digits.length) {
    return 0; // Handle lines with no digits
  }

  // If only one digit found, use it for both first and last
  let firstDigit = translateDigit(digits[0]);
  let lastDigit = translateDigit(digits[digits.length - 1]);

  // Combine digits into a two-digit number
  return parseInt(firstDigit + lastDigit);
});

// Sum all the numbers
result = numbers.reduce((sum, num) => sum + num, 0);
console.log("Answer Part 2:", result);

function translateDigit(digit) {
  switch (digit) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return digit;
  }
}
