// read the input file
const fs = require("fs");
const input = fs.readFileSync("tests/test_day1.txt", "utf8");

// the input file has two columns of numbers separated by whitespace
// split the input into two lists, one for each column
const list1 = [];
const list2 = [];
input.split("\n").forEach((line) => {
  const [firstNumber, secondNumber] = line.split("   ");
  if (firstNumber && secondNumber) {
    list1.push(parseInt(firstNumber));
    list2.push(parseInt(secondNumber));
  }
});

// sort the lists
list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);

// calculate the absolute difference between each pair in list1 and list2
// add it to the total distance
let distance = 0;
for (let i = 0; i < list1.length; i++) {
  distance += Math.abs(list1[i] - list2[i]);
}

console.log("Answer Part 1: " + distance);

// find the intersection of the two lists
const intersection = list1.filter((value) => list2.includes(value));

// count the number of times each number in the intersection appears in list2
// multiply this count by the number itself and add it to the similarity score
let similarityScore = 0;
for (const number of intersection) {
  similarityScore += list2.filter((value) => value === number).length * number;
}
console.log("Answer Part 2: " + similarityScore);
