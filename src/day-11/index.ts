import {getAllLines} from "../utils";
import {Point} from "../core";
import {isDefined} from "../utils/general";

class OctopusMap {
  constructor(readonly points: Point[][]) {
  }

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

  sum() {
    return this.points
      .reduce((sum, points) => sum + points.reduce((s, p) => s += p.value, 0), 0);
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
    const pendingFlashes = new Map<string, Point>();
    const flashQueue: Point[] = [];
    const enqueue = (point: Point) => {
      if (pendingFlashes.has(point.toString())) return;
      flashQueue.push(point);
      pendingFlashes.set(point.toString(), point);
    }
    let flashCount = 0;

    this.points.forEach(ps => ps.forEach(currentPoint => {
      currentPoint.value > 9 && enqueue(currentPoint)

      while (flashQueue.length > 0) {
        const point = flashQueue.shift()!;
        const neighbors = this.getNeighbors(point);
        point.value = 0;
        flashCount++;

        for (const neighbor of neighbors) {
          neighbor.value > 0 && neighbor.value++;
          neighbor.value > 9 && enqueue(neighbor)
        }
      }
    }))

    return flashCount;
  }

  private getNeighbors(point: Point): Point[] {
    return [
      [point.x, point.y - 1],
      [point.x + 1, point.y],
      [point.x, point.y + 1],
      [point.x - 1, point.y],
      [point.x - 1, point.y - 1],
      [point.x + 1, point.y - 1],
      [point.x + 1, point.y + 1],
      [point.x - 1, point.y + 1],
    ]
      .filter(([x, y]) => this.hasPoint(x, y))
      .map(([x, y]) => this.points[y][x]);
  }

  private hasPoint(x: number, y: number) {
    return isDefined(this.points[y]) && isDefined(this.points[y][x]);
  }
}


async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const points = lines.map((l, y) => l.split('').map((v, x) => new Point(x, y, Number(v))));
  const pointsCopy = points.map(ps => ps.map(p => p.copy()));
  const map = new OctopusMap(points);
  const mapTwo = new OctopusMap(pointsCopy);

  console.log('Pt 1.', map.simulateSteps(195));
  console.log('Pt 2.', mapTwo.findFirstSync());
}

main();
