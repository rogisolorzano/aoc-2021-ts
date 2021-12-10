import {getAllLines} from "../utils";
import {isDefined} from "../utils/general";

class Point {
  constructor(public x: number,
              public y: number,
              public value: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }
}

class HeightMap {
  constructor(readonly points: Point[][]) {}

  getLowPointRiskLevel() {
    return this.getLowPoints().reduce((riskLevel, point) => riskLevel + point.value + 1, 0);
  }

  getLargestBasinSizes() {
    return this.getLowPoints()
      .map(point => this.searchBasin(point))
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .reduce((total, basin) => total * basin.length, 1);
  }

  searchBasin(startingPoint: Point) {
    const visitedNodes = new Map([[startingPoint.toString(), startingPoint]]);
    const pointQueue = [startingPoint];

    while (pointQueue.length > 0) {
      this.getNeighbors(pointQueue.shift()!)
        .filter(p => p.value !== 9 && !visitedNodes.has(p.toString()))
        .forEach(p => {
          visitedNodes.set(p.toString(), p);
          pointQueue.push(p)
        });
    }

    return [...visitedNodes.values()];
  }

  getLowPoints() {
    return this.points.reduce((points, line) => {
      line.forEach((p) => this.isLowPoint(p) && points.push(p));
      return points;
    }, []);
  }

  isLowPoint(point: Point) {
    return this.getNeighbors(point).every(n => point.value < n.value);
  }

  getNeighbors(point: Point): Point[] {
    return [
      [point.x, point.y - 1],
      [point.x + 1, point.y],
      [point.x, point.y + 1],
      [point.x - 1, point.y],
    ]
      .filter(([x, y]) => this.hasPoint(x, y))
      .map(([x, y]) => this.points[y][x]);
  }

  hasPoint(x: number, y: number) {
    return isDefined(this.points[y]) && isDefined(this.points[y][x]);
  }
}

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const points = lines.map((l, y) => l.split('').map((v, x) => new Point(x, y, Number(v))));
  const map = new HeightMap(points);

  console.log('Pt 1. Low point risk level', map.getLowPointRiskLevel());
  console.log('Pt 2. Largest basin sizes', map.getLargestBasinSizes());
}

main();
