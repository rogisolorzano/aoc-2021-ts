import {getAllLines} from "../utils";

/**
 * Loop through all possible positions that the crabs can move to, starting from the
 * min crab position to the max crab position. At each step, we calculate the total
 * fuel that would be used for each crab using the provided cost function. Stops
 * when cost starts sloping up.
 *
 * @param positions
 * @param costFn
 */
const findOptimalAlignment = (positions: number[], costFn: (distance: number) => number) => {
  let currentCost = Infinity;
  let previousCost = Infinity;
  let currentPosition = Math.min(...positions);
  let maxPosition = Math.max(...positions);

  while (currentCost <= previousCost && currentPosition < maxPosition) {
    previousCost = currentCost;
    currentCost = positions.reduce((total, p) => total + costFn(Math.abs(currentPosition - p)), 0);
    currentPosition++;
  }

  return previousCost;
}

const simpleCostFn = (n: number) => n;
// https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF
const naturalNumbersSummationCostFn = (n: number) => n * (n + 1) / 2;

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const crabPositions = lines[0].split(',').map(n => Number(n));

  console.log("Part 1", findOptimalAlignment(crabPositions, simpleCostFn));
  console.log("Part 2", findOptimalAlignment(crabPositions, naturalNumbersSummationCostFn));
}

main();
