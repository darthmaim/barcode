import { dataWithWidth, Encoding } from "./helper";
import { Encoded, EncodedGroup } from "./types";

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

export function encode(value: string): Encoded {
  if(!isValid(value)) {
    throw new Error('Invalid EAN13 code');
  }

  const [left, right] = Structure[value[0]];
  const leftValue = value.substring(1, 7);
  const rightValue = value.substring(7, 13);

  const groups: EncodedGroup[] = [
    { type: 'quietZone', text: value[0], width: 11 },
    { type: 'marker', ...dataWithWidth('101') },
    { type: 'data', ...dataWithWidth(leftValue.split('').map((digit, index) => Encoding[digit][left[index]]).join('')), text: leftValue },
    { type: 'marker', ...dataWithWidth('01010') },
    { type: 'data', ...dataWithWidth(rightValue.split('').map((digit, index) => Encoding[digit][right[index]]).join('')), text: rightValue },
    { type: 'marker', ...dataWithWidth('101') },
    { type: 'quietZone', width: 7 }
  ];

  return {
    width: groups.reduce((width, group) => width + group.width, 0),
    groups,
  }
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
