import { encode as encodeEan13, isValid as isValidEan13 } from './ean13';
import { encode as encodeEan8, isValid as isValidEan8 } from './ean8';
import { Encoded } from './types';

export type Formats = 'ean13' | 'ean8';
export type AutoFormats = Formats | 'auto';

export interface Options {
  format?: AutoFormats;
}

function getFormat(format: AutoFormats, data: string): Formats | undefined {
  if(format !== 'auto') {
    return format;
  }

  return data.length === 13 ? 'ean13' : data.length === 8 ? 'ean8' : undefined;
}

export function isValid(data: string, { format = 'auto' }: Options = {}): boolean {
  const encodeFormat = getFormat(format, data);

  if(!encodeFormat) {
    throw new Error(`Unable to determine format of EAN value`);
  }

  if(encodeFormat === 'ean13') {
    return isValidEan13(data);
  } else if(encodeFormat === 'ean8') {
    return isValidEan8(data);
  } else {
    throw Error(`Format ${encodeFormat} not supported`);
  }
}

export function encode(data: string, { format = 'auto' }: Options = {}): Encoded {
  const encodeFormat = getFormat(format, data);

  if(!encodeFormat) {
    throw new Error(`Unable to determine format of EAN value`);
  }

  if(encodeFormat === 'ean13') {
    return encodeEan13(data);
  } else if(encodeFormat === 'ean8') {
    return encodeEan8(data);
  } else {
    throw Error(`Format ${encodeFormat} not supported`);
  }
}
