/**
 * DefineGroupsScreen.tsx
 * 
 * Allows the user to configure the groups
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const groupNames: string[] = [];

interface IGroupColumns {
  title: string;
  subNames: string[];
}

export default function GroupsScreen() {
  const [columns, setColumns] = useState<IGroupColumns[]>([]);

  const addColumn = () => {
    const newGroupName = `Group ${groupNames.length + 1}`;
    groupNames.push(newGroupName);
    setColumns([...columns, { title: newGroupName, subNames: [] }]);
  };

  const deleteColumn = (index: number) => {
    const updatedColumns = [...columns];
    const deletedGroupName = updatedColumns[index].title; // Get the name of the group to be deleted
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
    // Remove the deleted group name from groupNames array
    const groupIndex = groupNames.indexOf(deletedGroupName);
    if (groupIndex !== -1) {
      groupNames.splice(groupIndex, 1);
    }
  };

  const handleGroupNameChange = (index: number, name: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index].title = name;
    setColumns(updatedColumns);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define Groups Screen</Text>
      {columns.map((column, index) => (
        <View key={index} style={styles.columnContainer}>
          <TextInput
            style={styles.columnTitleInput}
            value={column.title}
            onChangeText={(text) => handleGroupNameChange(index, text)}
          />
          <TouchableOpacity onPress={() => deleteColumn(index)} style={styles.deleteColumnButton}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addColumn} style={styles.addColumnButton}>
        <Icon name="add" size={24} color="black" />
        <Text style={styles.addColumnButtonText}>Add Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  columnTitleInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  deleteColumnButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
  },
  addColumnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
  },
  addColumnButtonText: {
    marginLeft: 5,
  },
});
