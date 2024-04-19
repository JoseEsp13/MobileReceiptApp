import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Menu = ({ navigation }) => {
  const goToDefineGroups = () => {
    navigation.navigate('DefineGroups');
  };

  const goToSettings = () => {
    navigation.navigate('Settings'); // Navigate to the Settings screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToDefineGroups} style={styles.menuItem}>
        <Text>Define Groups</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSettings} style={styles.menuItem}> {/* Add TouchableOpacity for Settings */}
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Menu;

