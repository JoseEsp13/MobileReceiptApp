import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CameraIcon = ({ show }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Handle camera icon press action
    console.log('Camera icon pressed');
  };

  if (!show) {
    return null; 
  }

  return (
    <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
      <TouchableOpacity onPress={handlePress}>
        <Ionicons name="camera" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default CameraIcon;
