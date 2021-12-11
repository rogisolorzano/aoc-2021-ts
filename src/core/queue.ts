export interface IQueueable {
  toString(): string;
}

export class Queue<T extends IQueueable> {
  private qMap = new Map<string, T>();
  private q: T[] = [];

  dequeue(): T {
    return this.q.shift()!;
  }

  enqueue(v: T) {
    this.q.push(v);
    this.qMap.set(v.toString(), v);
  }

  enqueueUnique(v: T) {
    if (this.qMap.has(v.toString())) return;
    this.enqueue(v);
  }

  length() {
    return this.q.length;
  }
}