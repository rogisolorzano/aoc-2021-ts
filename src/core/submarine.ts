import {Bit, bitsToNumber, bitStringToNumber, filterByBitAtPosition, getCommonBitsForPosition} from "../utils/bits";

export enum Direction {
  Up,
  Down,
  Forward,
}

export interface MoveCommand {
  direction: Direction;
  units: number;
}

export interface Position {
  x: number;
  y: number;
  aim: number;
}

export class DiagnosticsReport {
  constructor(readonly gammaRate: number,
              readonly epsilonRate: number,
              readonly oxygenGeneratorRating: number,
              readonly co2ScrubberRating: number) {}

  getPowerConsumptionLevel() {
    return this.gammaRate * this.epsilonRate;
  }

  getLifeSupportRating() {
    return this.oxygenGeneratorRating * this.co2ScrubberRating;
  }
}

export class Submarine {
  position: Position = {x: 0, y: 0, aim: 0};
  diagnostics: DiagnosticsReport | null = null;

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

  loadDiagnosticReport(bits: string[]) {
    let oxyMatches = bits;
    let co2Matches = bits;
    const gammaBits: Bit[] = Array.from({length: bits[0].length});
    const epsilonBits: Bit[] = Array.from({length: bits[0].length});

    for (let x = 0; x < bits[0].length; x++) {
      const allCommon = getCommonBitsForPosition(bits, x);
      const oxyCommon = getCommonBitsForPosition(oxyMatches, x);
      const co2Common = getCommonBitsForPosition(co2Matches, x);

      gammaBits[x] = allCommon.most;
      epsilonBits[x] = allCommon.least;
      oxyMatches = oxyMatches.length > 1 ? filterByBitAtPosition(oxyMatches, x, `${oxyCommon.most}`) : oxyMatches;
      co2Matches = co2Matches.length > 1 ? filterByBitAtPosition(co2Matches, x, `${co2Common.least}`) : co2Matches;
    }

    this.diagnostics = new DiagnosticsReport(
      bitsToNumber(gammaBits),
      bitsToNumber(epsilonBits),
      bitStringToNumber(oxyMatches[0]),
      bitStringToNumber(co2Matches[0]),
    );
  }
}
