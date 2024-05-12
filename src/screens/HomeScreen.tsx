/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
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
  const [showGroupsModal, setShowGroupsModal] = useState(false);

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
    setShowGroupsModal(true);
  };

  const closeGroupsModal = () => {
    setShowGroupsModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <DemoButton key="Process Image" onPress={() => scanDocument()}>
        {'Process Image'}
      </DemoButton>
      <DemoButton key="Choose Group" onPress={chooseGroup}>
        {'Choose Group'}
      </DemoButton>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGroupsModal}
        onRequestClose={() => setShowGroupsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Groups</Text>
              <TouchableOpacity onPress={closeGroupsModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            {groupNames.map((groupName, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // Handle selection logic
                  console.log('Selected Group:', groupName);
                  setShowGroupsModal(false);
                }}
              >
                <Text style={styles.groupName}>{groupName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
  },
  groupName: {
    fontSize: 16,
    marginBottom: 5,
  },
});
