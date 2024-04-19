import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TitleHeader = ({ title }) => {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToDefineGroups = () => {
    setIsMenuOpen(false);
    navigation.navigate('DefineGroups');
  };

  const goToSettings = () => {
    setIsMenuOpen(false);
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuIconContainer}>
        <Ionicons name="menu" size={30} color="#333" style={styles.menuIcon} />
      </TouchableOpacity>
      <Text style={[styles.text, styles.title]}>The Original Receipt App</Text>
      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={goToDefineGroups} style={styles.menuItem}>
            <Text>Define Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToSettings} style={styles.menuItem}>
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
  menuIconContainer: {
    marginTop: 40,
  },
  menuIcon: {
    marginLeft: 10,
  },
  menu: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
  },
});

export default TitleHeader;
