import {IQueueable} from "./queue";

export class Point implements IQueueable {
  constructor(public x: number,
              public y: number,
              public value: number) {}

  toString() {
    return `${this.x},${this.y}`;
  }

  copy() {
    return new Point(this.x, this.y, this.value);
  }
}
