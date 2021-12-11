import {getAllLines} from "../utils";
import {Grid, Point, Queue} from "../core";

class OctopusGrid extends Grid {
  findFirstSync() {
    let stepCount = 0;

    while (true) {
      if (this.sum() === 0) break;
      this.step();
      stepCount++;
    }

    return stepCount;
  }

  simulateSteps(n: number) {
    let flashCount = 0;

    for (let i = 0; i < n; i++) {
      flashCount += this.step();
    }

    return flashCount;
  }

  private step() {
    this.points.forEach((ps) => ps.forEach(p => p.value++));
    return this.simulateFlashes();
  }

  /**
   * Loops through all octopus, putting octopus that needs to be flashed into a flash queue. If
   * an octopus flashes and notices it causes one of its neighbors to flash, it puts that into
   * the flash queue as well. The flash queue keeps processing until the chain reaction in that
   * area ends!
   */
  private simulateFlashes() {
    let flashCount = 0;
    const queue = new Queue<Point>();

    this.points.forEach(ps => ps.forEach(currentPoint => {
      currentPoint.value > 9 && queue.enqueueUnique(currentPoint)

      while (queue.length() > 0) {
        const point = queue.dequeue()!;
        const neighbors = this.getNeighbors(point, true);
        point.value = 0;
        flashCount++;

        for (const neighbor of neighbors) {
          neighbor.value > 0 && neighbor.value++;
          neighbor.value > 9 && queue.enqueueUnique(neighbor)
        }
      }
    }))

    return flashCount;
  }
}


async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const points = lines.map((l, y) => l.split('').map((v, x) => new Point(x, y, Number(v))));
  const pointsCopy = points.map(ps => ps.map(p => p.copy()));
  const map = new OctopusGrid(points);
  const mapTwo = new OctopusGrid(pointsCopy);

  console.log('Pt 1.', map.simulateSteps(195));
  console.log('Pt 2.', mapTwo.findFirstSync());
}

main();
