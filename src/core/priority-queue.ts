import {IQueue} from "./queue";
import {MinHeap} from "./min-heap";

export interface PriorityQueueItem {
  key: string;
  priority: number;
}

// This was my initial approach for day 15 part 1. Turned out being too slow for part 2!
// O(n) enqueue and dequeues. O(n log n) initial sort.
export class SlowPriorityQueue implements IQueue<PriorityQueueItem> {
  queue: PriorityQueueItem[];

  constructor(items: PriorityQueueItem[]) {
    this.queue = items.sort((i1, i2) => i2.priority - i1.priority);
  }

  dequeue() {
    return this.queue.pop();
  }

  enqueue({key, priority}: PriorityQueueItem) {
    for (let i = this.queue.length; i >= 0; i--) {
      if (i === 0 || this.queue[i - 1].priority >= priority) {
        this.queue.splice(i, 0, {key, priority});
        break;
      }
    }
  }

  length() {
    return this.queue.length;
  }
}


// Used a min heap internally for Day 15 part 2
// O(log n) dequeues and enqueues, O(n log n) initial sort
export class PriorityQueue implements IQueue<PriorityQueueItem> {
  queue: MinHeap<PriorityQueueItem>;

  constructor(items: PriorityQueueItem[]) {
    this.queue = new MinHeap(items, (p) => p.priority);
  }

  dequeue() {
    return this.queue.dequeue();
  }

  enqueue({key, priority}: PriorityQueueItem) {
    this.queue.enqueue({key, priority});
  }

  length() {
    return this.queue.length();
  }
}
