import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface ViewGroupsProps {
  groupNames: string[];
}

const ViewGroups: React.FC<ViewGroupsProps> = ({ groupNames }) => {
  return (
    <View style={styles.container}>
      {groupNames.map((groupName, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // Handle selection logic
            console.log('Selected Group:', groupName);
            // Add your logic here if needed
          }}
        >
          <Text style={styles.groupName}>{groupName}</Text>
        </TouchableOpacity>
      ))}
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
});

export default ViewGroups;
