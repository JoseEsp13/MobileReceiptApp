import { ITextRecognitionResponse } from "../components/mlkit";
import { IParser } from "./IParser";
import { isPrice } from "./parser"
import { ToastAndroid, Alert, Button } from 'react-native'
import { ColorSpace } from "react-native-reanimated";
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useEffect, useState } from 'react';
import * as routes from '../routes';

export function parseGeneric(response: ITextRecognitionResponse, ): {[key: string]: number} {
    // Makes you rescan the image
    const item_dict: {[key: string]: number} = {};
    const [scannedImage, setScannedImage] = useState<string | undefined>();
    const scanDocument = async () => {
      const { scannedImages } = await DocumentScanner.scanDocument();
      
      if (scannedImages && scannedImages.length > 0) {
        setScannedImage(scannedImages[0]);
      } else {
        setScannedImage(undefined);
      }
    };
    
    // Puts a little message for user
    ToastAndroid.showWithGravity("Please crop the image", 
    ToastAndroid.SHORT,
    ToastAndroid.TOP,
  );




    
    
    // Alert.alert(
    //   'title',
    //   'my msg',
    //   [
    //     {
    //       text: 'cancel',
    //       onPress: () => Alert.alert('cancel pressed'),
    //       style: 'cancel',
    //     },
    //   ],
    // )
    return item_dict
}


