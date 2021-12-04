import {getAllLines} from "../utils";

type BoardNodeValue = number;

interface BoardNodePosition {
  x: number;
  y: number;
}

interface BoardNode {
  position: BoardNodePosition;
  value: BoardNodeValue;
  isMarked: boolean;
}

class Board {
  winningNode: BoardNode | null = null;
  nodePositionMap: Record<BoardNodeValue, BoardNodePosition> = {};
  nodeGraph: BoardNode[][] = [];

  constructor(boardLines: string[], readonly boardSize = 5) {
    this.loadBoard(boardLines);
  }

  markNodeIfExists(value: BoardNodeValue): BoardNode | null {
    const node = this.getNodeByValue(value);

    if (!node) {
      return null;
    }

    node.isMarked = true;

    return node;
  }

  checkForWinAtNode(node: BoardNode): boolean {
    let foundUnmarkedXNode = false;
    let foundUnmarkedYNode = false;

    for (let x = 0; x < this.boardSize; x++) {
      foundUnmarkedXNode = !this.nodeGraph[node.position.y][x].isMarked;
      if (foundUnmarkedXNode) break;
    }

    for (let y = 0; y < this.boardSize; y++) {
      foundUnmarkedYNode = !this.nodeGraph[y][node.position.x].isMarked;
      if (foundUnmarkedYNode) break;
    }

    if (!foundUnmarkedXNode || !foundUnmarkedYNode) {
      this.winningNode = node;
    }

    return !foundUnmarkedXNode || !foundUnmarkedYNode;
  }

  getScore() {
    if (!this.winningNode) {
      console.warn('Board has not won yet.');
      return;
    }

    return this.getUnmarkedNodesSum() * this.winningNode.value;
  }

  private getUnmarkedNodesSum(): number {
    return this.nodeGraph.reduce((sum: number, nodes: BoardNode[]) => {
      for (const node of nodes) {
        if (!node.isMarked) {
          sum += node.value;
        }
      }
      return sum;
    }, 0);
  }

  private getNodeByValue(value: BoardNodeValue): BoardNode | null {
    if (!this.nodePositionMap[value]) return null;

    const {x, y} = this.nodePositionMap[value];

    return this.nodeGraph[y][x]
  }

  private loadBoard(boardLines: string[]) {
    boardLines.forEach((line, y) => {
      const lineNodes = line.split(' ').filter(l => l !== '').map(l => Number(l));
      this.nodeGraph.push([]);

      lineNodes.forEach((value, x) => {
        this.nodePositionMap[value] = {x, y};
        this.nodeGraph[y].push({position: {x, y}, isMarked: false, value});
      });
    });
  }
}

const createBoards = (lines: string[]) => {
  const boards = [];

  for (let i = 2; i < lines.length; i += 6) {
    boards.push(new Board(lines.slice(i, i + 5)));
  }

  return boards;
}

const simulateBingo = (numbersCalled: number[], boards: Board[], winningBoardPosition: number) => {
  const boardWins = Array.from({length: boards.length}, () => false);
  let boardWinsCount = 0;

  for (const number of numbersCalled) {
    for (let boardId = 0; boardId < boards.length; boardId++) {
      const markedNode = boards[boardId].markNodeIfExists(number);
      const boardWon = !!markedNode && boards[boardId].checkForWinAtNode(markedNode);

      if (boardWon && !boardWins[boardId]) {
        boardWins[boardId] = true;
        boardWinsCount++;
      }

      if (boardWinsCount === winningBoardPosition) {
        return boards[boardId];
      }
    }
  }
}

async function main() {
  const lines = (await getAllLines(__dirname, 'input.txt'));
  const numbersCalled = lines[0].split(',').map(n => Number(n));
  const boards = createBoards(lines);

  const firstWinningBoard = simulateBingo(numbersCalled, boards, 1);
  const lastWinningBoard = simulateBingo(numbersCalled, boards, boards.length);

  console.log('Score for first winning board', firstWinningBoard?.getScore());
  console.log('Score for last winning board', lastWinningBoard?.getScore());
}

main();
