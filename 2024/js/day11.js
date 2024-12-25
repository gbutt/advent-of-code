const fs = require('fs');

let input = `125 17`;
input = fs.readFileSync('./tests/test_day11.txt', 'utf-8').trim();

let stones = input.split(' ').map(x => parseInt(x, 10));

const iterations = 75;
const timer = Date.now();
const result = runBlink2(iterations, stones);
console.log('Answer Part 1: ', result);
console.log('Iterations:', iterations, 'Time to run:', Date.now() - timer, 'ms');

// run blink in a loop and count up the stones
function runBlink1(iterations, stones) {
  let result = [...stones];
  for (let i = 0; i < iterations; i++) {
    const blinktimer = Date.now();
    const stoneLenBefore = result.length;

    // blink each stone
    let nextResult = [];
    for (let i = 0; i < result.length; i++) {
      const stone = result[i];
      const nextBatch = blinkStone(stone);
      nextResult = nextResult.concat(nextBatch);
    }
    result = nextResult;

    console.log({
      run: i + 1,
      stoneLenBefore,
      stoneLenAfter: result.length
    }, 'Time to run:', Date.now() - blinktimer, 'ms');
  }
  return result.length;
}

// optimize blink for memory and performance
// use a recursive function to count each stone through all iterations and splits
// use a cache to remember previous calculations
function runBlink2(blinks, stones) {
  const stoneCache = {};
  let stoneCount = stones.length;
  stones.forEach((rootStone) => {
    stoneCount += simulateBlinks(rootStone, blinks);
  })
  return stoneCount;


  function simulateBlinks(stone, blinks) {
    // init cache
    stoneCache[stone] = stoneCache[stone] ?? {};

    // look for a cache hit
    if (stoneCache[stone][blinks]) {
      return stoneCache[stone][blinks];
    }

    let stoneCount = 0;
    const nextStones = blinkStone(stone);
    const nextBlinks = blinks - 1;
    // if next stones is two, record the split
    if (nextStones.length === 2) {
      stoneCount++;
    }

    // continue the remaining iterations
    if (nextBlinks > 0) {
      nextStones.forEach(stone => {
        stoneCount += simulateBlinks(stone, nextBlinks);
      });
    }

    // update cache
    stoneCache[stone][blinks] = stoneCount;

    return stoneCount;
  }
}

// blink the stone to get the next set of stones
function blinkStone(stone) {
  // rule 1
  if (stone === 0) {
    return [1];
  }
  // rule 2
  const stoneLog10 = Math.floor(Math.log10(stone));
  if (stoneLog10 % 2 == 1) {
    // split stone in two halves by shifting the decimal to the middle and taking each half
    const splitExponent = Math.pow(10, (stoneLog10 + 1) / 2);
    const splitStone = stone / splitExponent;
    const stone1b = Math.trunc(splitStone);
    const stone2b = Math.round((splitStone % 1) * splitExponent);
    return [stone1b, stone2b];
  }
  // rule 3
  return [stone * 2024];
}
