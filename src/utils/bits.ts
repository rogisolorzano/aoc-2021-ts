export type Bit = 1 | 0;
export type BitChar = '1' | '0';

export const bitStringToNumber = (bitString: string): number => parseInt(bitString, 2);
export const bitsToNumber = (bits: Bit[]): number => bitStringToNumber(bits.join(''));

export interface CommonBitsResult {
  most: Bit;
  least: Bit;
}

export const filterByBitAtPosition = (bits: string[], x: number, match: BitChar): string[] =>
  bits.filter(b => b[x] === match)

export const getCommonBitsForPosition = (bits: string[], x: number): CommonBitsResult => {
  let y = 0;
  const nYBits = bits.length;
  let zeros = 0;
  let ones = 0;

  while (y < nYBits) {
    if (bits[y][x] === '0') {
      zeros++;
    } else {
      ones++;
    }
    y++;
  }

  return {
    most: ones >= zeros ? 1 : 0,
    least: ones >= zeros ? 0 : 1,
  };
};
