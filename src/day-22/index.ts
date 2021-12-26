import {getAllLines, sum} from "../utils";

type CoordinateRange = [number, number];
type CuboidState = 'on' | 'off';

interface Instruction {
  action: CuboidState;
  cuboid: Cuboid;
}

/**
 * Builds the 6 possible cuboids that can result from the difference
 * between a and b, and only keeps the valid ones (volume > 0).
 */
const getRemainingCuboids = (a: Cuboid, b: Cuboid): Cuboid[] => [
  new Cuboid([a.x[0], a.x[1]], [a.y[0], a.y[1]], [a.z[0], b.z[0]]),
  new Cuboid([a.x[0], a.x[1]], [a.y[0], a.y[1]], [b.z[1], a.z[1]]),
  new Cuboid([b.x[0], a.x[1]], [a.y[0], b.y[0]], [b.z[0], b.z[1]]),
  new Cuboid([b.x[1], a.x[1]], [b.y[0], a.y[1]], [b.z[0], b.z[1]]),
  new Cuboid([a.x[0], b.x[1]], [b.y[1], a.y[1]], [b.z[0], b.z[1]]),
  new Cuboid([a.x[0], b.x[0]], [a.y[0], b.y[1]], [b.z[0], b.z[1]]),
].filter(c => c.volume() > 0);

class Cuboid {
  constructor(readonly x: CoordinateRange,
              readonly y: CoordinateRange,
              readonly z: CoordinateRange) {}

  /**
   * Whether this cuboid intersects with another.
   */
  intersectsWith(cuboid: Cuboid) {
    return ((this.x[1] > cuboid.x[0] && cuboid.x[1] > this.x[0])
      && (this.y[1] > cuboid.y[0] && cuboid.y[1] > this.y[0])
      && (this.z[1] > cuboid.z[0] && cuboid.z[1] > this.z[0]));
  }

  /**
   * Clips a cuboid to its own bounds.
   */
  clip(cuboid: Cuboid) {
    return new Cuboid(
      [Math.max(this.x[0], cuboid.x[0]), Math.min(this.x[1], cuboid.x[1])],
      [Math.max(this.y[0], cuboid.y[0]), Math.min(this.y[1], cuboid.y[1])],
      [Math.max(this.z[0], cuboid.z[0]), Math.min(this.z[1], cuboid.z[1])],
    );
  }

  /**
   * Subtracts the overlapping area of one cuboid, which might result in other cuboids.
   */
  subtract(cuboid: Cuboid): Cuboid[] {
    if (!this.intersectsWith(cuboid)) return [this];
    return getRemainingCuboids(this, this.clip(cuboid));
  }

  /**
   * Gets the cuboid volume.
   */
  volume() {
    return (this.x[1] - this.x[0]) * (this.y[1] - this.y[0]) * (this.z[1] - this.z[0]);
  }
}

/**
 * Processes an instruction. The main ideas are:
 *
 * - We might have a 'bounds cube', e.g x,y,z -50..50. If so, only worry about the
 *   parts of the cuboids that intersect with that relevant area.
 * - We are only keeping a list of cuboids that are 'on' in `activeCuboids`. These
 *   cuboids do not intersect each other!
 * - We process `activeCuboids` one by one transferring them into `newCuboids` as we go
 *   - If the instruction is 'on', we add the instruction cuboid into our list of new cuboids
 *   - If an active cuboid doesn't intersect with the instruction cuboid at all, the active
 *     cuboid is put into newCuboids as is
 * - We can then always remove the area of the instruction cuboid that overlaps with any
 *   other cuboid. (activeCuboids.shift())
 */
const processInstruction = (instruction: Instruction, activeCuboids: Cuboid[], boundsCuboid?: Cuboid) => {
  if (boundsCuboid && !boundsCuboid.intersectsWith(instruction.cuboid)) return activeCuboids;

  const newCuboids = (instruction.action === 'on') ? [instruction.cuboid] : [];

  while (activeCuboids.length > 0) {
    const cuboid = activeCuboids.shift()!;
    newCuboids.push(...cuboid.subtract(instruction.cuboid));
  }

  return newCuboids;
}

/**
 * Reboots a reactor with an optional cuboid to use as the bounds.
 */
const rebootReactor = (instructions: Instruction[], boundsCuboid?: Cuboid) => {
  let activeCuboids: Cuboid[] = [];

  for (const instruction of instructions) {
    activeCuboids = processInstruction(instruction, activeCuboids, boundsCuboid);
  }

  return sum(activeCuboids.map(c => c.volume()));
}

/**
 * Parses the input.
 */
const parseInput = (lines: string[]) =>
  lines.map<Instruction>(line => {
    const matches = [...line.matchAll(/^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/g)][0];
    return {
      action: matches[1] as unknown as CuboidState,
      cuboid: new Cuboid(
        [Number(matches[2]), Number(matches[3]) + 1],
        [Number(matches[4]), Number(matches[5]) + 1],
        [Number(matches[6]), Number(matches[7]) + 1],
      ),
    };
  });

async function main() {
  const instructions = parseInput(await getAllLines(__dirname, 'input.txt'));
  const boundsCuboid = new Cuboid([-50, 50], [-50, 50], [-50, 50]);

  console.log('Pt 1.', rebootReactor(instructions, boundsCuboid));
  console.log('Pt 2.', rebootReactor(instructions));
}

main();
