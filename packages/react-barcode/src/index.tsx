import { encode, EncodedGroup } from '@darthmaim/barcode/lib/ean13';
import type { FC } from 'react';

interface BarcodeProps {
  value: string;
  width?: number;
}

export const Barcode: FC<BarcodeProps> = ({ value, width = 113 }) => {
  const encoded = encode(value);

  const data = encoded.reduce<{ width: number, groups: ({ left: number, width: number } & EncodedGroup)[] }>(
    (data, group) => {
      const width = group.width ?? (group.type !== 'quietZone' ? group.data.length : 0);
      return ({
        width: data.width + width,
        groups: [...data.groups, { ...group, left: data.width, width: width }]
      })
    },
    { width: 0, groups: [] }
  );

  return (
    <svg viewBox="0 0 113 70" width={width} textAnchor="middle" dominantBaseline="bottom" fontSize={10} fontFamily="monospace">
      {data.groups.map((group) => (group.type !== 'quietZone' || group.text) && (
        <g>
          {group.type !== 'quietZone' && group.data.split('').map((bar, index) => bar === '1' ? (
            <rect x={group.left + index} y={0} width={1} height={group.type === 'marker' ? 66 : 60}/>
          ) : null)}
          {group.text && (
            <text x={group.left + group.width / 2} y={69}>{group.text}</text>
          )}
        </g>
      ))}
    </svg>
  );
};
