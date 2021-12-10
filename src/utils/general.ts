export const isDefined = <T>(v: T | undefined | null): v is T => typeof v !== 'undefined' && v !== null;
