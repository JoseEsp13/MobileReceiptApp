/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import { StyleSheet, Text, View } from 'react-native';
import { HomeScreenNavigationProps } from '../Navigator';
import { useEffect, useState } from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { DemoButton } from '../components/ui/DemoButton';
import * as routes from '../routes';
import { groupNames } from './GroupsScreen'; // Importing groups from defineGroups

export default function HomeScreen(props: HomeScreenNavigationProps) {
  const [scannedImage, setScannedImage] = useState<string | undefined>();

  const scanDocument = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument();
    
    if (scannedImages && scannedImages.length > 0) {
      setScannedImage(scannedImages[0]);
      onProcessImage(scannedImages[0]);
    } else {
      setScannedImage(undefined);
    }
  };

  const onProcessImage = (uri: string | undefined) => {
    if (uri) {
      props.navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
        uri: uri,
      });
    }
  };

  const chooseGroup = () => {
    // Displaying group names
    console.log('Groups:', groupNames);
  };

  return (
    <View style={styles.container}>
      <View style={{height: 48}}>
        <DemoButton key="Process Image" onPress={() => scanDocument()}>
          {'Process Image'}
        </DemoButton>
      </View>
      <View style={{height: 48}}>
        <DemoButton key="Choose Group" onPress={chooseGroup}>
          {'Choose Group'}
        </DemoButton>
      </View>
      
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