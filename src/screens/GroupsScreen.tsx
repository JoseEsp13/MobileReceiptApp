/**
 * DefineGroupsScreen.tsx
 * 
 * Allows the user to configure the groups
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { GroupsNavigationProps } from '../Navigator';
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IGroupColumns {
  title: string,
  subNames: string[]
}


export default function GroupsScreen (props: GroupsNavigationProps) {
  const [columns, setColumns] = useState<IGroupColumns[]>([{ title: 'Column 1', subNames: [] }]); // Initial state with one column

  const addColumn = () => setColumns([...columns, { title: '', subNames: [] }]);

  const deleteColumn = (index: number) => {
    Alert.alert(
      'Delete Column',
      `Are you sure you want to delete '${columns[index].title}'?`,
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

  const addSubName = (index: number) => {
    const updatedColumns = [...columns];
    updatedColumns[index].subNames.push('');
    setColumns(updatedColumns);
  };

  const deleteSubName = (columnIndex: number, subNameIndex: number) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].subNames.splice(subNameIndex, 1);
    setColumns(updatedColumns);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index].title = title;
    setColumns(updatedColumns);
  };

  const handleSubNameChange = (columnIndex: number, subNameIndex: number, value: string) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].subNames[subNameIndex] = value;
    setColumns(updatedColumns);
  };

  const renderColumn = (column: IGroupColumns, columnIndex: number) => {
    return (
      <View key={columnIndex} style={styles.columnContainer}>
        <TextInput
          style={styles.columnTitleInput}
          value={column.title}
          placeholder="Column title"
          onChangeText={(text) => handleTitleChange(columnIndex, text)}
        />
        {column.subNames.map((subName: string, subNameIndex: number) => (
          <View key={subNameIndex} style={styles.subNameContainer}>
            <TextInput
              style={styles.subNameInput}
              value={subName}
              placeholder="Sub-name"
              onChangeText={(text) => handleSubNameChange(columnIndex, subNameIndex, text)}
            />
            <TouchableOpacity
              onPress={() => deleteSubName(columnIndex, subNameIndex)}
              style={styles.deleteSubNameButton}>
              <Icon name="highlight-off" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={() => addSubName(columnIndex)} style={styles.addSubNameButton}>
            <Icon name="add-circle-outline" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteColumn(columnIndex)} style={styles.deleteColumnButton}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
        
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define Groups Screen</Text>
      {columns.map((column, index) => renderColumn(column, index))}
      <TouchableOpacity onPress={addColumn} style={styles.addColumnButton}>
        <Icon name="add" size={24} color="black" />
        <Text style={styles.addColumnButtonText}>Add Column</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 20,
  },
  columnTitleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subNameInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  deleteSubNameButton: {
    marginLeft: 10,
  },
  addSubNameButton: {

  },
  deleteColumnButton: {

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
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
