import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DefineGroups = () => {
  const [columns, setColumns] = useState(['Column 1']); // Initial state with one column

  const addColumn = () => {
    const newColumn = `Column ${columns.length + 1}`;
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (index) => {
    Alert.alert(
      'Delete Column',
      `Are you sure you want to delete '${columns[index]}'?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedColumns = [...columns];
            updatedColumns.splice(index, 1);
            setColumns(updatedColumns);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderColumn = (column, index) => {
    return (
      <View key={index} style={styles.columnContainer}>
        <Text style={styles.columnLabel}>{column}</Text>
        <TouchableOpacity onPress={() => deleteColumn(index)} style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define Groups Screen</Text>
      {columns.map((column, index) => renderColumn(column, index))}
      <TouchableOpacity onPress={addColumn} style={styles.addButton}>
        <Ionicons name="add" size={24} color="black" />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  columnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  columnLabel: {
    marginRight: 10,
  },
  optionsButton: {
    marginLeft: 'auto', // Push the button to the right
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
});

export default DefineGroups;
