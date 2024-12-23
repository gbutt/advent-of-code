const fs = require("fs");
const path = require("path");

// read input for day 2
const input = fs.readFileSync(
  path.join(__dirname, "../inputs/day2.txt"),
  "utf8"
);

// the input contains a list of games, one on each line.
// Each game contains several sets separated by a semicolon
// each set contains a number and a color pair, separated by a comma
// create a list of games, where each game is a list of sets and each set is an object that
// has a key for each color and the number is the value

const games = input
  .split("\n")
  .filter((line) => line?.includes(":"))
  .map((line) => line.split(":")[1])
  .map((line) =>
    line.split(";").map((set) =>
      set.split(",").reduce((acc, pair) => {
        const [number, color] = pair.trim().split(" ");
        return { ...acc, [color]: parseInt(number) };
      }, {})
    )
  );

const answerPart1 = games.reduce((acc, sets, index) => {
  const isValid = sets.every(
    (set) =>
      (set.red ?? 0) <= 12 && (set.green ?? 0) <= 13 && (set.blue ?? 0) <= 14
  );
  const gameId = index + 1;
  return acc + (isValid ? gameId : 0);
}, 0);

console.log("Answer Part 1:", answerPart1);

// Part 2
const answerPart2 = games.reduce((acc, sets) => {
  const stats = sets.reduce(
    (acc, set) => {
      acc.red = Math.max(acc.red, set.red ?? 0);
      acc.green = Math.max(acc.green, set.green ?? 0);
      acc.blue = Math.max(acc.blue, set.blue ?? 0);
      return acc;
    },
    { red: 0, green: 0, blue: 0 }
  );
  let power = (stats.red || 1) * (stats.green || 1) * (stats.blue || 1);
  return acc + power;
}, 0);

console.log("Answer Part 2:", answerPart2);
