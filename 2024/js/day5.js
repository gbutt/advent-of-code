const fs = require("fs");
var input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

var input = fs.readFileSync("./tests/test_day5.txt", "utf8").trim();

// split the input into rules and updates
const lines = input.split("\n");
const rules = [];
const updates = [];
let isParsingRules = true;
for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  const line = lines[lineIndex];
  // break when we hit an empty line
  if (line === "") {
    isParsingRules = false;
    continue;
  }

  if (isParsingRules) {
    // parse the rules from each line
    const [x, y] = line.split("|").map((x) => parseInt(x, 10));
    rules.push([x, y]);
  } else {
    // parse the updates
    const update = line.split(",").map((x) => parseInt(x, 10));
    updates.push(update);
  }
}

// Part 1 - find the updates that pass all rules

const { passingUpdates, failingUpdates } = updates.reduce(
  (acc, update) => {
    const matchedRules = findMatchedRules(update, rules);
    if (findFailingPageIndex(update, matchedRules) === -1) {
      acc.passingUpdates.push(update);
    } else {
      acc.failingUpdates.push(update);
    }
    return acc;
  },
  { passingUpdates: [], failingUpdates: [] }
);
const answer1 = getMiddlePages(passingUpdates);

console.log(
  "Answer Part 1:",
  answer1.reduce((acc, page) => acc + page, 0)
);

// Part 2 - find the failing updates and fix them

const patchedUpdates = failingUpdates.map((pages) => {
  const matchedRules = findMatchedRules(pages, rules);
  // find failing page
  let failingPageIndex = findFailingPageIndex(pages, matchedRules);
  // swap the failing page with the previous page and look for the next failing page
  while (failingPageIndex > -1) {
    pages = pages
      .slice(0, failingPageIndex - 1)
      .concat([
        pages[failingPageIndex],
        pages[failingPageIndex - 1],
        ...pages.slice(failingPageIndex + 1),
      ]);
    failingPageIndex = findFailingPageIndex(pages, matchedRules);
  }
  return pages;
});

const answer2 = getMiddlePages(patchedUpdates);

console.log(
  "Answer Part 2:",
  answer2.reduce((acc, page) => acc + page, 0)
);

/**
 * Filters and returns the rules that are matched by the given pages.
 * A rule is considered matched if both elements of the rule are present in the pages.
 *
 * @param {number[]} pages - The list of pages to check against the rules.
 * @param {Array.<Array.<number>>} rules - The list of rules, where each rule is a pair of numbers.
 * @returns {Array.<Array.<number>>} The list of rules that are matched by the pages.
 */
function findMatchedRules(pages, rules) {
  return rules.filter(
    (rule) => pages.includes(rule[0]) && pages.includes(rule[1])
  );
}

/**
 * Find the index of the first page that fails one of the rules in matchedRules
 * @param {number[]} pages - list of pages
 * @param {number[][]} matchedRules - list of rules that the update must match
 * @returns {number} index of failing page, or -1 if all rules are matched
 */
function findFailingPageIndex(pages, matchedRules) {
  return pages.findIndex((page, index) => {
    if (index === 0) {
      return false;
    }
    const previousPage = pages[index - 1];
    // rule fails if the current page must preceed the previous page
    return matchedRules.some(
      (rule) => rule[0] === page && rule[1] === previousPage
    );
  });
}

/**
 * Find the middle page for each passing update
 * @param {number[][]} passingUpdates - list of passing updates
 * @returns {number[]} middle page of each passing update
 */
function getMiddlePages(updates) {
  return updates.map((pages) => pages[(pages.length - 1) / 2]);
}
