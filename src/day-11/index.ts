import {getAllLines} from "../utils";
import {Point} from "../core";
import {isDefined} from "../utils/general";

class OctopusMap {
  constructor(readonly points: Point[][]) {}

  findFirstSync() {
    let stepCount = 0;
    while (true) {
      this.step();
      stepCount++;
      if (this.sum() === 0) {
        break;
      }
    }

    return stepCount;
  }

  simulateSteps(n: number) {
    let flashCount = 0;

    for (let i = 0; i < n; i++) {
      flashCount += this.step();
    }
    this.print();

    return flashCount;
  }

  print() {
    const mapStr = this.points.reduce((str, points) => {
      points.forEach((p) => str += p.value);
      str += '\n';
      return str;
    }, '');
    console.log(mapStr);
  }

  sum() {
    return this.points.reduce((sum, points) => {
      points.forEach((p) => sum += p.value);
      return sum;
    }, 0);
  }

  private step() {
    for (let y = 0; y < this.points.length; y++) {
      for (let x = 0; x < this.points[y].length; x++) {
        this.points[y][x].value++;
      }
    }

    return this.simulateFlashes();
  }

  private simulateFlashes() {
    const pendingFlashes = new Map<string, Point>();
    const flashQueue = [];
    let flashCount = 0;

    for (let y = 0; y < this.points.length; y++) {
      for (let x = 0; x < this.points[y].length; x++) {
        const thisPoint = this.points[y][x];

        if (thisPoint.value > 9) {
          flashQueue.push(thisPoint);
          pendingFlashes.set(thisPoint.toString(), thisPoint);
        }

        while (flashQueue.length > 0) {
          const point = flashQueue.shift()!;
          const neighbors = this.getNeighbors(point);
          point.value = 0;
          flashCount++;

          for (const neighbor of neighbors) {
            if (neighbor.value > 0) {
              neighbor.value++;
            }

            if (neighbor.value > 9 && !pendingFlashes.has(neighbor.toString())) {
              flashQueue.push(neighbor);
              pendingFlashes.set(neighbor.toString(), neighbor);
            }
          }
        }
      }
    }

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
