import {getAllLines} from "../utils";
import {Grid, Point, Queue} from "../core";

class OctopusGrid extends Grid {
  findFirstSync(captureCountAt: number) {
    let stepCount = 0;
    let flashCount = 0;

    while (true) {
      if (this.sum() === 0) break;
      let count = this.step();
      if (stepCount < captureCountAt) flashCount += count;
      stepCount++;
    }

    return [stepCount, flashCount];
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
      if (currentPoint.value > 9) queue.enqueueUnique(currentPoint);

      while (queue.length() > 0) {
        const point = queue.dequeue()!;
        point.value = 0;
        flashCount++;

        for (const neighbor of this.getNeighbors(point, true)) {
          if (neighbor.value > 0) neighbor.value++;
          if (neighbor.value > 9) queue.enqueueUnique(neighbor);
        }
      }
    }))

    return flashCount;
  }
}


async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const points = lines.map((l, y) => l.split('').map((v, x) => new Point(x, y, Number(v))));
  const map = new OctopusGrid(points);
  const [syncedAtStep, flashesAt195] = map.findFirstSync(195);

  console.log('Pt 1.', flashesAt195);
  console.log('Pt 2.', syncedAtStep);
}

main();
