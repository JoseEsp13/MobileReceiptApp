/**
 * DefineGroupsScreen.tsx
 * 
 * Allows the user to configure the groups
 */
// DefineGroupsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const groupNames: string[] = [];
export const groupData: IGroupColumns[] = [];

interface ISubGroup {
  name: string;
}

interface IGroupColumns {
  title: string;
  subGroups: ISubGroup[];
}

export default function GroupsScreen() {
  const [columns, setColumns] = useState<IGroupColumns[]>([]);

  // Inside addColumn()
const addColumn = () => {
  const newGroupName = `Group ${groupNames.length + 1}`;
  groupNames.push(newGroupName);
  setColumns([...columns, { title: newGroupName, subGroups: [] }]);
  groupData.push({ title: newGroupName, subGroups: [] }); // Update groupData
};

// Inside deleteColumn()
const deleteColumn = (index: number) => {
  const deletedGroupName = columns[index].title;
  const updatedColumns = columns.filter((_, i) => i !== index);
  setColumns(updatedColumns);
  const groupIndex = groupNames.indexOf(deletedGroupName);
  if (groupIndex !== -1) {
    groupNames.splice(groupIndex, 1);
    groupData.splice(groupIndex, 1); // Remove the corresponding entry from groupData
  }
};

// Inside addSubGroup()
const addSubGroup = (index: number) => {
  const updatedColumns = [...columns];
  const subGroupIndex = updatedColumns[index].subGroups.length; // Use the length of subGroups array as the index
  updatedColumns[index].subGroups.push({ name: `Subgroup ${subGroupIndex + 1}` }); // Use subGroupIndex + 1 as the subgroup number
  setColumns(updatedColumns);
  groupData[index].subGroups.push({ name: `Subgroup ${subGroupIndex + 1}` }); // Update groupData with the correct subgroup number
};

// Inside deleteSubGroup()
const deleteSubGroup = (groupIndex: number, subGroupIndex: number) => {
  const updatedColumns = [...columns];
  updatedColumns[groupIndex].subGroups.splice(subGroupIndex, 1);
  setColumns(updatedColumns);
  groupData[groupIndex].subGroups.splice(subGroupIndex, 1); // Remove the corresponding entry from groupData
};

// Inside handleGroupNameChange()
const handleGroupNameChange = (index: number, name: string) => {
  const updatedColumns = [...columns];
  updatedColumns[index].title = name;
  setColumns(updatedColumns);
  groupData[index].title = name; // Update groupData
};

// Inside handleSubGroupNameChange()
// Inside handleSubGroupNameChange()
const handleSubGroupNameChange = (groupIndex: number, subGroupIndex: number, name: string) => {
  const updatedColumns = [...columns];
  updatedColumns[groupIndex].subGroups[subGroupIndex].name = name;
  setColumns(updatedColumns);

  // Update only the name of the subgroup in groupData
  groupData[groupIndex].subGroups[subGroupIndex].name = name;
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
          {column.subGroups.map((subGroup, subIndex) => (
            <View key={subIndex} style={styles.subGroupContainer}>
              <TextInput
                style={styles.subGroupInput}
                value={subGroup.name}
                onChangeText={(text) => handleSubGroupNameChange(index, subIndex, text)}
              />
              <TouchableOpacity onPress={() => deleteSubGroup(index, subIndex)} style={styles.deleteSubGroupButton}>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addSubGroup(index)} style={styles.addSubGroupButton}>
            <Icon name="add" size={20} color="black" />
            <Text style={styles.addSubGroupButtonText}>Add Subgroup</Text>
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
    marginBottom: 20,
  },
  columnTitleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  deleteColumnButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  subGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subGroupInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  deleteSubGroupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  addSubGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addSubGroupButtonText: {
    marginLeft: 5,
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
