import {getAllLines} from "../utils/io";
import {capitalize} from "../utils/string";

enum Direction {
  Up,
  Down,
  Forward,
}

interface MoveCommand {
  direction: Direction;
  units: number;
}

interface Position {
  x: number;
  y: number;
  aim: number;
}

class Submarine {
  readonly position: Position;

  constructor(startingPosition: Position) {
    this.position = startingPosition;
  }

  navigate(commands: MoveCommand[]) {
    for (const command of commands) {
      switch (command.direction) {
        case Direction.Up:
          this.position.y -= command.units;
          break;
        case Direction.Down:
          this.position.y += command.units;
          break;
        case Direction.Forward:
          this.position.x += command.units;
          break;
      }
    }
  }

  navigateWithAim(commands: MoveCommand[]) {
    for (const command of commands) {
      switch (command.direction) {
        case Direction.Up:
          this.position.aim -= command.units;
          break;
        case Direction.Down:
          this.position.aim += command.units;
          break;
        case Direction.Forward:
          this.position.x += command.units;
          this.position.y += this.position.aim * command.units;
          break;
      }
    }
  }
}

async function main() {
  const commands = (await getAllLines(__dirname, 'input.txt'))
    .map(line => line.split(' '))
    .map<MoveCommand>(([direction, distance]) => ({
      direction: Direction[capitalize(direction) as keyof typeof Direction],
      units: Number(distance),
    }));

  const submarine = new Submarine({x: 0, y: 0, aim: 0});
  submarine.navigate(commands);

  const coolerSubmarine = new Submarine({x: 0, y: 0, aim: 0});
  coolerSubmarine.navigateWithAim(commands);

  console.log('Simple navigation:', submarine.position.x * submarine.position.y);
  console.log('Navigation with aim:', coolerSubmarine.position.x * coolerSubmarine.position.y);
}

main();
