/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { DemoButton } from '../components/ui/DemoButton';
import routes, { IHomeScreenTabProps } from '../routes';
import { groupNames } from './GroupsScreen'; // Importing groups from defineGroups
import useAppContext from '../components/hooks/useAppContext';


export default function HomeScreen(props: IHomeScreenTabProps) {
  
  const ctx = useAppContext();

  const scanDocument = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument();
    
    if (scannedImages && scannedImages.length > 0) {
      onProcessImage(scannedImages[0]);
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
      {/*<View style={{height: 48}}>
        <DemoButton key="Select Image" onPress={() => props.navigation.navigate(routes.SELECT_SCREEN)}>
          {'Select Image'}
        </DemoButton>
      </View>*/}
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