import * as React from 'react';
import {Text, View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';

interface DemoResponseProps {
    children: ImagePickerResponse | null
}

export function DemoResponse(props: DemoResponseProps) {
  if (props.children == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{JSON.stringify(props.children, null, 2)}</Text>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: '#dcecfb',
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
  },
  text: {
    color: 'black',
  },
});