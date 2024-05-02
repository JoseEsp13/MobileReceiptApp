/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import { StyleSheet, Text, View, Image } from 'react-native';
import { HomeScreenNavigationProps } from '../Navigator';
import { FloatingAction } from "react-native-floating-action";
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import DocumentScanner from 'react-native-document-scanner-plugin'
import { useNavigation } from '@react-navigation/native';
import { DemoButton } from '../components/ui/DemoButton';
import * as routes from '../routes';

export default function HomeScreen(props: HomeScreenNavigationProps) {
  const [scannedImage, setScannedImage] = useState<string | undefined>();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages }= await DocumentScanner.scanDocument()
    
    // get back an array with scanned image file paths
    if (scannedImages && scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
      onProcessImage(scannedImages[0])
    }
    else {
      setScannedImage(undefined)
    }
  }

  const onProcessImage = (uri: string | undefined) => {
    if (uri) {
      props.navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
        uri: uri,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: 48}}>
        <DemoButton onPress={() => scanDocument()}>
          {'Take Picture'}
        </DemoButton>
      </View>
    </View>
  );
}
