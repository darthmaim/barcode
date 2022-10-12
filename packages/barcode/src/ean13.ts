export function checkdigit(value: string): string {
  const sum = value.substring(0, 12)
    .split('')
    .map((n) => Number(n))
    .reduce((sum, digit, index) => {
      return sum + (digit * (index % 2 ? 3 : 1))
    });

  return ((10 - (sum % 10)) % 10).toString();
}

const REGEX = /^[0-9]{13}$/;

export function isValid(value: string) {
  return REGEX.test(value) && checkdigit(value) === value[12];
}

export type EncodedGroup = {
  text?: string;
  width?: number;
} & ({
  type: 'quietZone';
} | {
  type: 'marker' | 'data';
  data: string;
})

export function encode(value: string): EncodedGroup[] {
  if(!isValid(value)) {
    throw new Error('Invalid EAN13 code');
  }

  const [left, right] = Structure[value[0]];
  const leftValue = value.substring(1, 7);
  const rightValue = value.substring(7, 13);

  return [
    { type: 'quietZone', text: value[0], width: 11 },
    { type: 'marker', data: '101' },
    { type: 'data', data: leftValue.split('').map((digit, index) => Encoding[digit][left[index]]).join(''), text: leftValue },
    { type: 'marker', data: '01010' },
    { type: 'data', data: rightValue.split('').map((digit, index) => Encoding[digit][right[index]]).join(''), text: rightValue },
    { type: 'marker', data: '101' },
    { type: 'quietZone', width: 7 }
  ];
}

const Structure: Record<string, [left: string, right: string]> = {
  '0': ['LLLLLL', 'RRRRRR'],
  '1': ['LLGLGG', 'RRRRRR'],
  '2': ['LLGGLG', 'RRRRRR'],
  '3': ['LLGGGL', 'RRRRRR'],
  '4': ['LGLLGG', 'RRRRRR'],
  '5': ['LGGLLG', 'RRRRRR'],
  '6': ['LGGGLL', 'RRRRRR'],
  '7': ['LGLGLG', 'RRRRRR'],
  '8': ['LGLGGL', 'RRRRRR'],
  '9': ['LGGLGL', 'RRRRRR'],
};

const Encoding: Record<string, Record<string, string>> = {
  '0': { L: '0001101', G: '0100111', R: '1110010' },
  '1': { L: '0011001', G: '0110011', R: '1100110' },
  '2': { L: '0010011', G: '0011011', R: '1101100' },
  '3': { L: '0111101', G: '0100001', R: '1000010' },
  '4': { L: '0100011', G: '0011101', R: '1011100' },
  '5': { L: '0110001', G: '0111001', R: '1001110' },
  '6': { L: '0101111', G: '0000101', R: '1010000' },
  '7': { L: '0111011', G: '0010001', R: '1000100' },
  '8': { L: '0110111', G: '0001001', R: '1001000' },
  '9': { L: '0001011', G: '0010111', R: '1110100' },
}
