/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { DemoButton } from '../components/ui/DemoButton';
import routes, { IHomeScreenTabProps } from '../routes';
import useAppContext from '../components/hooks/useAppContext';


export default function HomeScreen(props: IHomeScreenTabProps) {
  
  const scanDocument = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1
    });
    
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

  return (
    <View style={styles.container}>
      <View style={{height: 60}}>
        <DemoButton key="Process Image" onPress={() => scanDocument()}>
          {'Process Image'}
        </DemoButton>
      </View>
      <View style={{height: 60, marginTop: 100}}>
        <DemoButton key="Logout" onPress={() => props.navigation.navigate(routes.LOGOUT_SCREEN)}>
          {'Logout'}
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