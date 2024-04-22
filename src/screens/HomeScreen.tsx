import { Text, View } from 'react-native';
import { HomeScreenNavigationProps } from '../Navigator';
import { FloatingAction } from "react-native-floating-action";
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import { useState } from 'react';


export default function HomeScreen(props: HomeScreenNavigationProps) {

  const [response, setResponse] = useState<ImagePickerResponse | null>(null);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <FloatingAction  onPressItem={() => ImagePicker.launchCamera({
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        }, setResponse)} 
      />
    </View>
  );
}