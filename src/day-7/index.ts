import {getAllLines} from "../utils";

type CostFn = (distance: number) => number;

const getTotalCost = (currentPosition: number, positions: number[], costFn: CostFn) =>
  positions.reduce((total, p) => total + costFn(Math.abs(currentPosition - p)), 0)

/**
 * Loop through all possible positions that the crabs can move to, starting from the
 * min crab position to the max crab position. At each step, we calculate the total
 * fuel that would be used for each crab using the provided cost function. Stops
 * when cost starts sloping up.
 */
const findOptimalAlignmentSolution1 = (positions: number[], costFn: CostFn) => {
  let currentCost = Infinity;
  let previousCost = Infinity;
  let currentPosition = Math.min(...positions);
  let maxPosition = Math.max(...positions);

  while (currentCost <= previousCost && currentPosition < maxPosition) {
    previousCost = currentCost;
    currentCost = getTotalCost(currentPosition, positions, costFn);
    currentPosition++;
  }

  return previousCost;
}

/**
 * Same idea as solution 1 but uses a binary search approach to cut time complexity down to O(n log k).
 *
 * This approach finishes in 9 iterations vs my initial solution which takes 478 iterations.
 */
const findOptimalAlignmentSolution2 = (positions: number[], costFn: CostFn) => {
  let currentCost = Infinity;
  let minPosition = Math.min(...positions);
  let maxPosition = Math.max(...positions);

  while (minPosition < maxPosition) {
    const currentPosition = Math.floor((maxPosition + minPosition) / 2);
    const leftCost = getTotalCost(currentPosition - 1, positions, costFn);
    const rightCost = getTotalCost(currentPosition + 1, positions, costFn);
    currentCost = getTotalCost(currentPosition, positions, costFn);

    if (leftCost < currentCost) {
      maxPosition = currentPosition;
    } else if (rightCost < currentCost) {
      minPosition = currentPosition;
    } else {
      break;
    }
  }

  return currentCost;
}

const simpleCostFn = (n: number) => n;

// Initial approach was using a hashmap to memoize the sum at each n so
// that I can add n + 1 to it, but noticed a pattern when I printed it
// https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF
const naturalNumbersSummationCostFn = (n: number) => n * (n + 1) / 2;

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const crabPositions = lines[0].split(',').map(n => Number(n));

  // Initial solution
  console.log("Part 1", findOptimalAlignmentSolution1(crabPositions, simpleCostFn));
  console.log("Part 2", findOptimalAlignmentSolution1(crabPositions, naturalNumbersSummationCostFn));

  // Binary search approach
  console.log("Part 1", findOptimalAlignmentSolution2(crabPositions, simpleCostFn));
  console.log("Part 2", findOptimalAlignmentSolution2(crabPositions, naturalNumbersSummationCostFn));
}

main();
