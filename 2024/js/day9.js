const fs = require('fs');
var input = '2333133121414131402';

var input = fs.readFileSync("./tests/test_day9.txt", "utf8").trim();

// unpack the input into a list of symbols
let result1 = input.split("").reduce((acc, char, charIndex) => {
  const length = parseInt(char, 10);
  let fileId;
  if (charIndex % 2 === 0) {
    fileId = charIndex / 2;
    symbol = fileId;
  } else {
    symbol = '.';
  }
  for (let i = 0; i < length; i++) {
    acc.push(symbol);
  }
  return acc;
}, []);

// console.log('result1 before:', result1);
const defragedResult1 = defrag1(result1);
// console.log('result1 after:', defragedResult1.join(''));
const checksum1 = calculateChecksum1(defragedResult1);
console.log('Answer Part 1:', checksum1);

// unpack the input into a list of symbols and their lengths
let result2 = input.split("").reduce((acc, char, charIndex) => {
  const length = parseInt(char, 10);
  let fileId;
  if (charIndex % 2 === 0) {
    fileId = charIndex / 2;
    symbol = fileId;
  } else {
    symbol = '.';
  }
  acc.push({ symbol, length });
  return acc;
}, []);

// console.log('result2 before:', result2);
const defragedResult2 = defrag2(result2);
// console.log('result2 after:', printDiskAllocs(defragedResult2));
const checksum2 = calculateChecksum2(defragedResult2);
console.log('Answer Part 2:', checksum2);

// console.log('before:', result1);

// const defragedResult = defrag(result1);



function defrag(diskAllocs) {
  let i = 0;
  let j = diskAllocs.length - 1;
  const result = [];
  while (i < j) {
    // skip the tail side if it is empty space
    if (diskAllocs[j].symbol !== '.') {
      let headRemaining = diskAllocs[i].length;
      let tailRemaining = diskAllocs[j].length;
      while (tailRemaining > 0) {
        while (diskAllocs[i].symbol !== '.' && i < j) {
          for (let l = 0; l < diskAllocs[i].length; l++) {
            result.push(diskAllocs[i].symbol);
          }
          i++;
          headRemaining = diskAllocs[i].length;
        }
        result.push(diskAllocs[j].symbol);
        tailRemaining--;
        headRemaining--;
        if (headRemaining === 0) {
          i++;
          headRemaining = diskAllocs[i].length;
        }
      }
    }
    j--;
  }
  return result;
}


function defrag1(diskBlocks) {
  // walk the list from the head and from the tail
  // use two indices to track the position of the head and tail
  // once the two indices meet, the defrag is done
  let result = [...diskBlocks];
  let headIndex = 0;
  let tailIndex = result.length - 1;
  while (tailIndex > headIndex) {
    // if the tail position is a fileId, move it to the first empty space on the head side
    if (result[tailIndex] !== '.') {
      // move head index to the next empty space
      while (result[headIndex] !== '.' && headIndex < tailIndex) {
        headIndex++;
      }
      // stop if we reach the tail index
      if (headIndex === tailIndex) {
        break;
      }
      // swap the head and tail
      result[headIndex] = result[tailIndex];
      result[tailIndex] = '.';
    }
    tailIndex--;
  }
  return result;
}

function calculateChecksum1(diskBlocks) {
  let sum = 0;
  for (let i = 1; i < diskBlocks.length; i++) {
    const char = diskBlocks[i];
    if (char === '.') {
      break;
    }
    const fileId = diskBlocks[i];
    sum += fileId * i;
  }
  return sum;
}

function defrag2(diskAllocs) {
  const result = [...diskAllocs];
  // walk diskAllocs from the tail
  // move files into the first empty space on the head side large enough to fit the file
  // if no such space is found, the file remains in place
  let tailIndex = result.length - 1;
  while (tailIndex > 0) {
    // walk tail to the next file
    while (tailIndex > 0 && result[tailIndex].symbol === '.') {
      tailIndex--;
    }
    // find the first empty space on the head side large enough to fit the file
    let headIndex = 0;
    while (headIndex < tailIndex && (result[headIndex].symbol !== '.' || result[headIndex].length < result[tailIndex].length)) {
      headIndex++;
    }
    // if we found a space, move the file to the head position
    if (headIndex < tailIndex) {
      const file = result[tailIndex];
      const head = result[headIndex];
      result[headIndex] = file;
      if (head.length === file.length) {
        // if the lengths match, do a simple swap
        result[tailIndex] = head;
      } else {
        // otherwise, split the head space into parts
        result.splice(headIndex + 1, 0, { symbol: '.', length: head.length - file.length });
        result[tailIndex + 1] = { symbol: '.', length: file.length };
      }
    }
    // move to the next file
    tailIndex--;
  }
  return result;
}

function calculateChecksum2(diskAllocs) {
  let position = 0;
  return diskAllocs.reduce((acc, alloc) => {
    if (alloc.symbol !== '.') {
      for (let i = 0; i < alloc.length; i++) {
        acc += alloc.symbol * (i + position);
      }
    }
    position += alloc.length;
    return acc;
  }, 0);
}

function printDiskAllocs(diskAllocs) {
  return diskAllocs.reduce((acc, char) => {
    for (let i = 0; i < char.length; i++) {
      acc += char.symbol;
    }
    return acc;
  }, '');
}


