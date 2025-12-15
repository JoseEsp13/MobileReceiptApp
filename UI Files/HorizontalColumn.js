import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HorizontalColumn = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.recentText}>Recent</Text>
      <View style={styles.columnContainer}>
        <View style={styles.grayContainer}></View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 400,
  },
  recentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 10,
  },
  columnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayContainer: {
    width: '25%',
    height: 100, 
    backgroundColor: '#ccc', 
    marginRight: 10,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default HorizontalColumn;
