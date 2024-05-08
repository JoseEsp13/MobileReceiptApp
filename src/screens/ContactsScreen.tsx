/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import { StyleSheet, Text, View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'


export default function ContactsScreen() {

  return (
    <View style={{flex: 1}}>
      <Icon name="Group" size={36} />
      <Text style={styles.title}>No contacts to show</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});