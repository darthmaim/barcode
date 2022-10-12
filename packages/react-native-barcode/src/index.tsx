import { FC, Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { encode } from '@darthmaim/barcode';

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
  },
  bar: {
    position: 'absolute',
    top: 0,
    width: 1,
    backgroundColor: '#000',
  },
  text: {
    top: 60,
    position: 'absolute',
    textAlign: 'center',
    width: 100,
    marginLeft: -50,
    fontSize: 10,
    color: '#000',
    fontFamily: 'monospace',
  }
});

export interface BarCodeProps {
  value: string;
  flat?: boolean;
}

export const BarCode: FC<BarCodeProps> = ({ value, flat }) => {
  const encoded = encode(value);

  let left = 0;

  return (
    <View style={[styles.wrapper]}>
      {encoded.groups.map((group, groupIndex) => {
        const groupElement = (group.type !== 'quietZone' || group.text) && (
          <Fragment key={groupIndex}>
            {group.type !== 'quietZone' && group.data.split('').map((bar, index) => bar === '1' ? (
              // eslint-disable-next-line react-native/no-inline-styles
              <View key={index} style={[styles.bar, { left: left + index, height: group.type === 'marker' && !flat ? 66 : 60 }]}/>
            ) : null)}
            {group.text && (
              <Text style={[styles.text, { left: left + group.width / 2}]}>{group.text}</Text>
            )}
          </Fragment>
        );

        left += group.width;

        return groupElement;
      })}
    </View>
  );
};
