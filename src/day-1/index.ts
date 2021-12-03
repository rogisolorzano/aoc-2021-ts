import {getAllLines} from "../utils/io";

/**
 * Iterate at window end of n size, calculating the next window sum and comparing with the current.
 *
 * NextWindowSum = CurrentWindowSum - ValueOfCurrentWindowStart + ValueOfNextWindowEnd
 */
const getTotalIncrements = (depths: number[], windowSize: number) => {
  let increments = 0;
  let currentWindowSum = depths.slice(0, windowSize).reduce((t, v) => t + v);

  for (let windowEnd = windowSize - 1; windowEnd < depths.length - 1; windowEnd++) {
    const nextWindowSum = currentWindowSum - depths[windowEnd - (windowSize - 1)] + depths[windowEnd + 1];

    if (nextWindowSum > currentWindowSum) {
      increments++;
    }
    currentWindowSum = nextWindowSum;
  }

  return increments;
}

async function main() {
  const depths = (await getAllLines(__dirname, 'input.txt')).map(n => Number(n));

  console.log('Window size 1', getTotalIncrements(depths, 1));
  console.log('Window size 3', getTotalIncrements(depths, 3));
}

main();
