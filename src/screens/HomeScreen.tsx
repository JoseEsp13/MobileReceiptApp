/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { DemoButton } from '../components/ui/DemoButton';
import routes, { IHomeScreenDrawerProps } from '../routes';
import { groupNames } from './GroupsScreen'; // Importing groups from defineGroups
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import firebase from '../components/state/firebaseStorage';
import useAppContext from '../components/hooks/useAppContext';
import utility from '../components/util/utility';


export default function HomeScreen(props: IHomeScreenDrawerProps) {
  
  const ctx = useAppContext();
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
      <View style={{height: 60}}>
        <DemoButton key="Process Image" onPress={() => scanDocument()}>
          {'Process Image'}
        </DemoButton>
      </View>
      <View style={{height: 60, marginTop: 40}}>
        <DemoButton key="Choose Group" onPress={chooseGroup}>
          {'Choose Group'}
        </DemoButton>
      </View>
      <View style={{height: 60, marginTop: 40}}>
        <DemoButton key="Test Create Doc" onPress={() => firebase.createUserAsync(({
          ...utility.createEmptyUserObject(),
          name: "David",
          email: "dsserrat@ucsc.edu",
          uid: ctx.authenticated?.uid ?? "123"
        }))}>
          {'Test Create Doc'}
        </DemoButton>
      </View>
      <View style={{height: 60, marginTop: 40}}>
        <DemoButton key="Test Get Doc" onPress={() => ctx.fetchUserCloudData()}>
          {'Test Get Doc'}
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