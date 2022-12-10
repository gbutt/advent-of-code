/**
 * creates an array of incrementing numbers
 * @param length the number of elements in the array
 * @param startIndex the value of the starting number in the array
 */
export function range(start: number, length: number, stepSize = 1) {
  let range = Array.from(Array(length).keys());
  if (stepSize != 1) {
    range = range.map((x) => x * stepSize);
  }
  if (start > 0) {
    range = range.map((x) => x + start);
  }

  return range;
}

/**
 * adds two or more arrays by summing the elements in each corresponding index
 * arrays must be of the same length
 */
export function addVectors<T extends Array<number>>(
  arr1: T,
  ...rest: Array<{ [K in keyof T]: number }>
) {
  return arr1.map((item1, index) =>
    rest.reduce((sum, arr) => sum + arr[index], item1)
  ) as {
    [K in keyof T]: number;
  };
}
