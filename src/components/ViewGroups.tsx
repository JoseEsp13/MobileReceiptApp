// ViewGroups.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { groupNames as importedGroupNames, groupData as importedGroupData } from '../screens/GroupsScreen'; 

interface SubGroup {
  name: string;
}

interface Group {
  title: string;
  subGroups: SubGroup[];
}

interface ViewGroupsProps {
  groupNames: string[];
  dict: any;
}

const ViewGroups: React.FC<ViewGroupsProps> = ({ groupNames: importedGroupNames, dict }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newSubGroupName, setNewSubGroupName] = useState<string>('');
  const [subGroups, setSubGroups] = useState<string[]>([]);
  const [groupNames, setGroupNames] = useState<string[]>(importedGroupNames);
  const [groupData, setGroupData] = useState<Group[]>(importedGroupData);

  const handleBack = () => {
    setSelectedSubGroup(null);
    setTotalCost(0); // Reset total cost when going back
  };

  const renderSubGroups = (groupName: string) => {
    const selectedGroupData = groupData.find(group => group.title === groupName);
    if (selectedGroupData) {
      return (
        <View>
          <Text style={styles.modalTitle}>{groupName}</Text>
          {selectedGroupData.subGroups.map((subGroup, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedSubGroup(subGroup.name)}
              style={styles.subGroupNameContainer}
            >
              <Text style={styles.subGroupName}>{subGroup.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderDictItems = () => {
    if (!selectedSubGroup) return null;
    let total = 0;
    return Object.keys(dict).map((key, index) => {
      if (key !== 'TOTAL') {
        const cost = parseFloat(dict[key]);
        total += cost;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleDictItemPress(key, cost)}
            style={styles.dictItemContainer}
          >
            <View style={styles.dictItem}>
              <Text style={styles.dictKey}>{key}:</Text>
              <Text style={styles.dictValue}>{dict[key]}</Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <View key={index} style={styles.TOTALContainer}>
            <View style={styles.dictItem}>
              <Text style={styles.dictKey}>{key}:</Text>
              <Text style={styles.dictValue}>{dict[key]}</Text>
            </View>
          </View>
        );
      }
    });
  };

  const handleDictItemPress = (key: string, cost: number) => {
    // Add cost to total
    setTotalCost(prevTotal => prevTotal + cost);
    console.log(`Clicked on ${key}`);
  };

  const handleAddGroup = () => {
    // Save the new group and its sub-groups
    const newGroupData: Group = {
      title: newGroupName,
      subGroups: subGroups.map(subGroup => ({ name: subGroup })),
    };
    setGroupNames(prevGroupNames => [...prevGroupNames, newGroupName]);
    setGroupData(prevGroupData => [...prevGroupData, newGroupData]);
    // Reset input fields and sub-groups array
    setNewGroupName('');
    setNewSubGroupName('');
    setSubGroups([]);
    // Close the modal
    setShowAddGroupModal(false);
  };

  const handleAddSubGroup = () => {
    // Add the new sub-group to the array
    setSubGroups(prevSubGroups => [...prevSubGroups, newSubGroupName]);
    // Reset the sub-group input field
    setNewSubGroupName('');
  };

  return (
    <View style={styles.container}>
      {groupNames.map(groupName => (
        <TouchableOpacity
          key={groupName}
          onPress={() => setSelectedGroup(groupName)}
        >
          <Text style={styles.groupName}>{groupName}</Text>
        </TouchableOpacity>
      ))}

      {/* Add Group Button */}
      <Button title="Add Group" onPress={() => setShowAddGroupModal(true)} />

      {/* Modal for Adding Group */}
      <Modal
        visible={showAddGroupModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddGroupModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Group</Text>
            <TextInput
              placeholder="Group Name"
              style={styles.input}
              value={newGroupName}
              onChangeText={text => setNewGroupName(text)}
            />
            <TextInput
              placeholder="Sub-Group Name"
              style={styles.input}
              value={newSubGroupName}
              onChangeText={text => setNewSubGroupName(text)}
            />
            <Button title="Add Sub-Group" onPress={handleAddSubGroup} />
            <Button title="Add Group" onPress={handleAddGroup} />
          </View>
        </View>
      </Modal>

      {/* Modal for Viewing Group Details */}
      <Modal
        visible={!!selectedGroup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedGroup(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          {selectedSubGroup && (
              <TouchableOpacity onPress={() => {
              handleBack();
              setSelectedSubGroup(null);
          }}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
            <Text style={styles.modalTitle}>{selectedSubGroup}</Text>
            {selectedSubGroup ? (
              renderDictItems()
            ) : (
              renderSubGroups(selectedGroup!)
            )}
            {selectedSubGroup && (
              <Text style={styles.totalText}>Total Cost: {totalCost.toFixed(2)}</Text>
            )}
            <Button title="Close" onPress={() => setSelectedGroup(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    marginBottom: 5,
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
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subGroupNameContainer: {
    marginBottom: 5,
  },
  subGroupName: {
    fontSize: 16,
  },
  dictContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  dictItemContainer: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  TOTALContainer:{
    borderRadius: 5,
    marginBottom: 5,
  },
  dictItem: {
    flexDirection: 'row',
    padding: 10,
  },
  dictKey: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  dictValue: {
    marginLeft: 5,
  },
  totalText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ViewGroups;
