import { encode } from '@darthmaim/barcode';
import type { FC } from 'react';

interface BarcodeProps {
  value: string;
  height?: number | 'auto';
  width?: number;
  flat?: boolean;
}

export const Barcode: FC<BarcodeProps> = ({ value, height = 70, width, flat = false }) => {
  const encoded = encode(value);

  let left = 0;

  return (
    <svg viewBox={`0 0 ${encoded.width} 70`} height={height} width={width} textAnchor="middle" dominantBaseline="bottom" fontSize={11} fontFamily="monospace" shapeRendering="crispedges">
      {encoded.groups.map((group, index) => {
        const groupElement = (group.type !== 'quietZone' || group.text) && (
          <g key={index}>
            {group.type !== 'quietZone' && group.data.split('').map((bar, index) => bar === '1' ? (
              <rect key={index} x={left + index} y={0} width={1} height={group.type === 'marker' && !flat ? 66 : 60}/>
            ) : null)}
            {group.text && (
              <text x={left + group.width / 2} y={69}>{group.text}</text>
            )}
          </g>
        );

        left += group.width;

        return groupElement;
      })}
    </svg>
  );
};
