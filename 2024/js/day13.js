const fs = require('fs');
let input = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`.trim();

input = fs.readFileSync('./tests/test_day13.txt', 'utf8').trim();


const buttonCostA = 3;
const buttonCostB = 1;

// parse input into machines
const machines = input.split('\n').reduce((acc, line) => {
  if (line === '') {
    acc.push({});
    return acc;
  }
  const machine = acc[acc.length - 1];
  const [type, coordStr] = line.split(': ');
  if (type === 'Button A') {
    machine.buttonA = coordStr.split(', ').map(c => parseInt(c.split('+')[1]));
  }
  if (type === 'Button B') {
    machine.buttonB = coordStr.split(', ').map(c => parseInt(c.split('+')[1]));
  }
  if (type === 'Prize') {
    machine.prize = coordStr.split(', ').map(c => parseInt(c.split('=')[1]));
  }
  return acc;
}, [{}]);

// determine the cost of each machine
const answer1 = machines.reduce((acc, machine) => {
  return acc + determineMachineTokenCost(machine);
}, 0);
console.log('Anwser Part 1:', answer1);

// mutate the machine input to increase the prize by 10000000000000
machines.forEach(machine => {
  machine.prize = [machine.prize[0] + 10000000000000, machine.prize[1] + 10000000000000];
});
// determine the cost of each machine
const answer2 = machines.reduce((acc, machine) => {
  return acc + determineMachineTokenCost(machine);
}, 0);
console.log('Anwser Part 2:', answer2);


function determineMachineTokenCost({ buttonA, buttonB, prize }) {
  /*
   the problem forms a system of linear equations:
    x * buttonA[0] + y * buttonB[0] = prize[0]
    y * buttonA[1] + y * buttonB[1] = prize[1]
    
    becomes

    |buttonA[0] buttonB[0]| |x| = |prize[0]|
    |buttonA[1] buttonB[1]| |y| = |prize[1]|

    solve using cramer's rule:
    y = det(buttonA, prize) / det(buttonA, buttonB)
    x = det(prize, buttonB) / det(buttonA, buttonB)
  */

  // 
  const denominator = determinate(buttonA, buttonB);
  if (denominator === 0) {
    // console.log('no solution exists for:', machine);
    return acc;
  }
  const bPresses = determinate(buttonA, prize) / denominator;
  const aPresses = determinate(prize, buttonB) / denominator;
  // check to see if a positive integer solution exists
  const solutionExists = Number.isInteger(aPresses) &&
    Number.isInteger(bPresses) &&
    aPresses >= 0 &&
    bPresses >= 0;
  return solutionExists ?
    aPresses * buttonCostA + bPresses * buttonCostB :
    0;
}

function determinate(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}
