import {getAllLines} from "../utils";


class Die {
  n = 0;
  rollCount = 0;

  next() {
    if (this.n === 100) this.n = 0;
    this.n++;
    this.rollCount++;
    return this.n;
  }
}

class Player {
  constructor(public position: number, public score: number = 0) {}
}

const warmupGame = (positions: number[]) => {
  const die = new Die();
  const player1 = new Player(positions[0]);
  const player2 = new Player(positions[1]);
  let playerTurn = 1;

  while (player1.score < 1000 && player2.score < 1000) {
    const toMove = die.next() + die.next() + die.next();
    const player = (playerTurn === 1) ? player1 : player2;
    let position = (player.position + toMove) % 10;
    position = position === 0 ? 10 : position;
    player.position = position;
    player.score += position;
    playerTurn = playerTurn === 1 ? 2 : 1;
  }

  return Math.min(player1.score, player2.score) * die.rollCount;
}

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  let positions = [Number(lines[0].split(': ')[1]), Number(lines[1].split(': ')[1])];

  console.log('Pt 1.', warmupGame(positions));
  console.log('Pt 2.'); // WIP
}

main();
