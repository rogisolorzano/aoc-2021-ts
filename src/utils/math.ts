export const sum = (a: number[]) => a.reduce((sum, n) => sum + n, 0);

export const count = <T>(a: T[], predicate: (v: T) => boolean) =>
  a.reduce((count, n) => predicate(n) ? count + 1 : count, 0);
