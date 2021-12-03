import {getAllLines, capitalize} from "../utils";
import {Direction, MoveCommand, Submarine} from "../core";

async function main() {
  const commands = (await getAllLines(__dirname, 'input.txt'))
    .map(line => line.split(' '))
    .map<MoveCommand>(([direction, distance]) => ({
      direction: Direction[capitalize(direction) as keyof typeof Direction],
      units: Number(distance),
    }));

  const submarine = new Submarine();
  const coolerSubmarine = new Submarine();

  submarine.navigate(commands);
  coolerSubmarine.navigateWithAim(commands);

  console.log('Simple navigation:', submarine.position.x * submarine.position.y);
  console.log('Navigation with aim:', coolerSubmarine.position.x * coolerSubmarine.position.y);
}

main();
