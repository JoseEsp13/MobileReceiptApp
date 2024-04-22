/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import { StyleSheet, Text, View } from 'react-native';
import { HomeScreenNavigationProps } from '../Navigator';
import { FloatingAction } from "react-native-floating-action";
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import { useState } from 'react';


export default function HomeScreen(props: HomeScreenNavigationProps) {

  const [response, setResponse] = useState<ImagePickerResponse | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <FloatingAction onPressMain={() => ImagePicker.launchCamera({
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        }, setResponse)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});