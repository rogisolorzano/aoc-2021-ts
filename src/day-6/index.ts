import {getAllLines} from "../utils";

const getInitialFishCounts = (fish: number[]) => fish.reduce((counts, f) => {
    counts[f]++;
    return counts;
  },
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
);

/**
 * Keep track of fish counts at each position, moving counts over one to the left [index - 1] of
 * current fish's internal timer. Special case when we hit 0, each fish in the [0] index creates
 * a new fish, so add that to [8]. The timer gets reset for those fish as well so add that amount to [6].
 */
const simulateFishGrowth = (fish: number[], nDays: number) => {
  let fishCounts = getInitialFishCounts(fish);
  let days = 0;

  while (days < nDays) {
    const tempCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    fishCounts.forEach((nFishes, fishInternalTimer) => {
      if (fishInternalTimer === 0) {
        tempCounts[8] += nFishes;
        tempCounts[6] += nFishes;
      } else {
        tempCounts[fishInternalTimer - 1] += nFishes;
      }
    });

    fishCounts = tempCounts;
    days++;
  }

  return fishCounts.reduce((sum, c) => sum + c, 0);
}

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const fish = lines[0].split(',').map(n => Number(n));

  console.log("Fishys after 80 days", simulateFishGrowth(fish, 80));
  console.log("Fishys after 256 days", simulateFishGrowth(fish, 256));
}

main();
