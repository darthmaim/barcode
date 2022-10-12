import { dataWithWidth, Encoding } from "./helper";
import { Encoded, EncodedGroup } from "./types";

export function checkdigit(value: string): string {
  const sum = value.substring(0, 7)
    .split('')
    .map((n) => Number(n))
    .reduce((sum, digit, index) => {
      return sum + (digit * (index % 2 ? 1 : 3));
    });

  return ((10 - (sum % 10)) % 10).toString();
}

const REGEX = /^[0-9]{8}$/;

export function isValid(value: string) {
  return REGEX.test(value) && checkdigit(value) === value[7];
}

export function encode(value: string): Encoded {
  if(!isValid(value)) {
    throw new Error('Invalid EAN8 code');
  }

  const [left, right] = ['LLLL', 'RRRR'];
  const leftValue = value.substring(0, 4);
  const rightValue = value.substring(4, 8);

  const groups: EncodedGroup[] = [
    { type: 'quietZone', width: 7 },
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
  };
}
