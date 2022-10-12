export type EncodedGroup = {
  text?: string;
  width: number;
} & ({
  type: 'quietZone';
} | {
  type: 'marker' | 'data';
  data: string;
});

export type Encoded = {
  width: number;
  groups: EncodedGroup[];
};
