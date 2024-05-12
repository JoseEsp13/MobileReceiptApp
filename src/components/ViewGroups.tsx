// ViewGroups.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { groupNames, groupData } from '../screens/GroupsScreen'; 

interface ViewGroupsProps {
  groupNames: string[];
  dict: any;
}

const ViewGroups: React.FC<ViewGroupsProps> = ({ groupNames, dict }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleBack = () => {
    setSelectedSubGroup(null);
    setTotalCost(0); // Reset total cost when going back
  };

  const renderSubGroups = (groupName: string) => {
    const selectedGroupData = groupData.find(group => group.title === groupName);
    if (selectedGroupData) {
      return selectedGroupData.subGroups.map((subGroup, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedSubGroup(subGroup.name)}
          style={styles.subGroupNameContainer}
        >
          <Text style={styles.subGroupName}>{subGroup.name}</Text>
        </TouchableOpacity>
      ));
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

      {/* Modal */}
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
            <Text style={styles.modalTitle}>{selectedGroup}</Text>
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
});

export default ViewGroups;
