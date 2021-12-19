import {getAllLines, naturalNumbersSummation} from "../utils";

interface ProbePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface TargetBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const fvx = (n: number, startVx: number) => Math.max(0, startVx - n);
const fvy = (n: number, startVy: number) => startVy - n;
const fx1 = (n: number, startVx: number) => (n * startVx) - naturalNumbersSummation(n - 1);
const fx2 = (n: number, startVx: number) => fx1(startVx - 1, startVx) + 1;
const fy = (n: number, startVy: number) => (n * startVy) - naturalNumbersSummation(n - 1);

const isInTarget = ({x, y}: ProbePosition, bounds: TargetBounds) =>
  x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;

const isPastTarget = ({x, y}: ProbePosition, bounds: TargetBounds) => x > bounds.maxX || y < bounds.minY;

const getProbePositionAtStep = (n: number, [startVx, startVy]: [number, number]): ProbePosition => ({
  x: fvx(n, startVx) > 0 ? fx1(n, startVx) : fx2(n, startVx),
  y: fy(n, startVy),
  vx: fvx(n, startVx),
  vy: fvy(n, startVy),
});

const getXVelocityRanges = (targetBounds: TargetBounds) => {
  let d = 0;
  let n = 0;
  while (d < targetBounds.minX) {
    n++;
    d = naturalNumbersSummation(n);
  }
  return [n, targetBounds.maxX];
}
const getYVelocityRanges = (targetBounds: TargetBounds) => [targetBounds.minY, Math.abs(targetBounds.minY)];
const getMaxYForVelocity = (yVelocity: number) => fy(yVelocity, yVelocity);

const launchProbe = (startVelocity: [number, number], targetBounds: TargetBounds) => {
  let probePosition = getProbePositionAtStep(0, startVelocity);
  let step = 1;

  while (!isPastTarget(probePosition, targetBounds)) {
    probePosition = getProbePositionAtStep(step, startVelocity);
    step++;

    if (isInTarget(probePosition, targetBounds)) {
      return probePosition;
    }
  }

  return null;
}

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const parsedTargets = [...lines[0].matchAll(/x=(.*)\.\.(.*), y=(.*)\.\.(.*)/g)][0].slice(1, 5).map(n => Number(n));
  const targetBounds: TargetBounds = {
    minX: parsedTargets[0],
    maxX: parsedTargets[1],
    minY: parsedTargets[2],
    maxY: parsedTargets[3],
  };
  const [minVX, maxVX] = getXVelocityRanges(targetBounds);
  const [minVY, maxVY] = getYVelocityRanges(targetBounds);
  const velocities = [];

  for (let xv = minVX; xv <= maxVX; xv++) {
    for (let yv = minVY; yv <= maxVY; yv++) {
      const position = launchProbe([xv, yv], targetBounds);

      if (position !== null) {
        velocities.push(position);
      }
    }
  }

  console.log('Pt 1.', Math.max(...velocities.map(v => getMaxYForVelocity(v.y))));
  console.log('Pt 2.', velocities.length);
}

main();
