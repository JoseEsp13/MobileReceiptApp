import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Button, Animated, TouchableOpacity } from 'react-native';
import { IParserResult } from '../parsers/IParser';
import AwesomeButton, { ThemedButton } from "react-native-really-awesome-button";
import useAppContext from '../components/hooks/useAppContext';
import { IGroup } from '../components/state/IFirebaseDocument';
import { configureLayoutAnimationBatch } from 'react-native-reanimated/lib/typescript/reanimated2/core';

interface VerificationProps {
    parserResult: IParserResult;
}

// Helper function to calculate the total sum, excluding the "TOTAL" key
const calculateTotalSum = (entries: [string, string][]): number => {
    const totalSum = entries.reduce((sum, [key, value]) => {
        if (key !== "TOTAL") {
            return sum + (parseFloat(value) || 0);
        }
        return sum;
    }, 0);
    return parseFloat(totalSum.toFixed(2)); // Round the total to two decimal places
};

const Verification = ({ parserResult }: VerificationProps) => {
    const initialEntries: [string, string][] = Object.entries(parserResult).map(([key, value]) => [key, value.toString()]);

    const [itemEntries, setItemEntries] = useState<[string, string][]>(initialEntries);
    const [totalSum, setTotalSum] = useState<number>(calculateTotalSum(initialEntries));
    const [deletedEntries, setDeletedEntries] = useState<[string, string][]>([]);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
    const [groupItems, setGroupItems] = useState<[string, string][]>([]); // State to hold items and prices for the selected group
    const [editable, setEditable] = useState(true); // State to control the editability of TextInput fields
    const [isFinalized, setIsFinalized] = useState(false); // State to track whether editing is finalized
    const [clickedSubGroup, setClickedSubGroup] = useState<string | null>(null); // State to keep track of clicked subgroup
    const [subGroupValues, setSubGroupValues] = useState<{ [key: string]: string }>({}); // State to keep track of subgroup values
    const [addedItems, setAddedItems] = useState<{ [subGroupName: string]: Set<string> }>({}); // Track added items for each subgroup

    useEffect(() => {
        setTotalSum(calculateTotalSum(itemEntries));
        parserResult.TOTAL = parseFloat(totalSum.toFixed(2));
    }, [itemEntries]);

    useEffect(() => {
        if (selectedGroup) {
            const groupItemsFiltered = itemEntries.filter(([key]) =>
                selectedGroup.contacts.some(contact => contact.name === key)
            );
            setGroupItems(groupItemsFiltered);
        }
    }, [selectedGroup, itemEntries]);

    const handleKeyChange = (text: string, index: number): void => {
        setItemEntries((prevEntries) => {
            const updatedEntries = [...prevEntries];
            const [_, value] = updatedEntries[index];
            updatedEntries[index] = [text, value];
            return updatedEntries;
        });
    };

    const handleValueChange = (text: string, index: number): void => {
        setItemEntries((prevEntries) => {
            const updatedEntries = [...prevEntries];
            const [key, _] = updatedEntries[index];
            updatedEntries[index] = [key, text];
            return updatedEntries;
        });
    };

    const handleItemClick = (key: string, value: string): void => {
        if (clickedSubGroup) {
            setSubGroupValues((prevValues) => {
                const currentValue = parseFloat(prevValues[clickedSubGroup] || '0');
                const itemValue = parseFloat(value);
                let newValue;
                const addedItemsForSubGroup = new Set(addedItems[clickedSubGroup] || []);

                if (addedItemsForSubGroup.has(key)) {
                    newValue = (currentValue - itemValue).toFixed(2); // Subtract the value if already added
                    addedItemsForSubGroup.delete(key);
                } else {
                    newValue = (currentValue + itemValue).toFixed(2); // Add the value if not added
                    addedItemsForSubGroup.add(key);
                }

                setAddedItems((prevAddedItems) => ({
                    ...prevAddedItems,
                    [clickedSubGroup]: addedItemsForSubGroup
                }));

                return {
                    ...prevValues,
                    [clickedSubGroup]: newValue
                };
            });
        }
    };

    const handleSubGroupClick = (subGroupName: string): void => {
        console.log(`Clicked subgroup: ${subGroupName}`);
        setClickedSubGroup(subGroupName);
        finalize();
    };

    const addNewEntry = (): void => {
        setItemEntries((prevEntries) => [...prevEntries, ["", "0"]]);
    };

    const deleteEntry = (index: number): void => {
        setItemEntries((prevEntries) => {
            const entryToDelete = prevEntries[index];
            setDeletedEntries((prevDeleted) => [entryToDelete, ...prevDeleted]);
            return prevEntries.filter((_, i) => i !== index);
        });
    };

    const undoDelete = (): void => {
        if (deletedEntries.length > 0) {
            const [lastDeleted, ...restDeleted] = deletedEntries;
            setItemEntries((prevEntries) => [...prevEntries, lastDeleted]);
            setDeletedEntries(restDeleted);
        }
    };

    const finalize = () => {
        setEditable(false); 
        setIsFinalized(true);
    };
    const unfinalize = () => {
        setEditable(true); 
        setIsFinalized(false); 
        setSubGroupValues((prevValues) => {
            const updatedValues = { ...prevValues };
            if (selectedGroup) {
                selectedGroup.contacts.forEach(contact => {
                    updatedValues[contact.name] = '0'; // Reset the value to '0' for each contact
                });
            }
            return updatedValues;
        });
    };
    
    

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {itemEntries.map(([key, value], index) => {
                    if (key !== "TOTAL") {
                        return (
                            <View key={index} style={styles.row}>
                                {!isFinalized && (
                                    <View style={styles.item}>
                                        <TextInput
                                            style={styles.input}
                                            value={key}
                                            onChangeText={(text) => handleKeyChange(text, index)}
                                            editable={!isFinalized && editable} // Allow editing until finalized
                                        />
                                    </View>
                                )}
                                {isFinalized ? (
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => handleItemClick(key, value)} style={{ width: '100%' }}>
                                            <Text style={styles.input}>{`${key}: ${value}`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.item}>
                                        <TextInput
                                            style={styles.input}
                                            value={value}
                                            onChangeText={(text) => handleValueChange(text, index)}
                                            editable={!isFinalized && editable} // Allow editing until finalized
                                        />
                                    </View>
                                )}
                                <View style={styles.buttonItem}>
                                    <Button title="-" onPress={() => deleteEntry(index)} disabled={!editable} />
                                </View>
                            </View>
                        );
                    }
                    return null;
                })}
                <View style={styles.row}>
                    <View style={styles.item}>
                        <Text style={styles.title}>TOTAL:</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>{totalSum.toFixed(2)}</Text>
                    </View>
                </View>
                <Button title="Add Item" onPress={addNewEntry} disabled={!editable} />
                <Button title="Undo" onPress={undoDelete} disabled={deletedEntries.length === 0 || !editable} />
                {isFinalized && (
                    <View style={styles.goBackButtonContainer}>
                        <Button title="Go Back" onPress={unfinalize} />
                    </View>
                )}
                <Text style={styles.chooseGroupText}>Group:</Text>
                {selectedGroup && (
                    <View style={styles.chosenGroup}>
                        <Text style={styles.chosenGroupText}>{selectedGroup.name}</Text>
                    </View>
                )}
                
                <View style={styles.panelButtonContainer}>
                    <Button title="+" onPress={() => setIsPanelVisible(true)} />
                </View>
                <View style={styles.buttonContainer}>
                    {selectedGroup && selectedGroup.contacts.map((contact, index) => (
                        <View key={index} style={styles.subGroupContainer}>
                            <ThemedButton
                                name='rick'
                                textColor='gray'
                                textSize={5}
                                type='primary'
                                raiseLevel={3}
                                width={50}
                                height={50}
                                backgroundColor={contact.bgColor} // can either be the contacts back ground color or letter color
                                onPress={() => handleSubGroupClick(contact.name)}
                            >
                            <Text style={styles.subGroupText}></Text>
                            </ThemedButton>
                            <Text style={styles.subGroupText}>
                                {contact.name}: ${subGroupValues[contact.name] || '0'}
                            </Text>
                        </View>
                    ))}
                </View>
                {/* Display item names and prices */}
                {groupItems.length > 0 && (
                    <View style={styles.subGroupContainer}>
                        {groupItems.map(([key, value], index) => (
                            <View key={index} style={styles.row}>
                                <View style={styles.item}>
                                    <Text style={styles.subGroupText}>{key}</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.subGroupText}>{value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                <SlideUpPanel isVisible={isPanelVisible} onClose={() => setIsPanelVisible(false)} setSelectedGroup={setSelectedGroup} />
            </View>
        </ScrollView>
    )
};


const SlideUpPanel: React.FC<{ isVisible: boolean; onClose: () => void; setSelectedGroup: React.Dispatch<React.SetStateAction<IGroup | null>> }> = ({
    isVisible,
    onClose,
    setSelectedGroup,
}) => {
    const ctx = useAppContext();
    const slideUpValue = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (isVisible) {
            Animated.timing(slideUpValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideUpValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible, slideUpValue]);

    const slideUpAnimation = {
        transform: [
            {
                translateY: slideUpValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                }),
            },
        ],
    };

    return (
        <Animated.View style={[styles.slideUpPanel, slideUpAnimation]}>
            <ScrollView>
                {ctx.user.groups.map((group, index) => (
                    <Button key={index} title={group.name} onPress={() => { onClose(); setSelectedGroup(group); }} />
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        marginTop: 8,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    item: {
        flex: 1,
        marginHorizontal: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f91ec',   // Blue color
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow buttons to wrap to the next line
        justifyContent: 'space-around',
        marginTop: 20,
    },
    buttonItem: {
        marginHorizontal: 5,
    },
    chooseGroupText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    panelButtonContainer: {
        alignItems: 'center',
    },
    slideUpPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        elevation: 5,
    },
    chosenGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    chosenGroupText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    subGroupContainer: {
        marginTop: 10,
        paddingHorizontal: 16,
    },
    subGroupText: {
        fontSize: 14,
        paddingVertical: 2,
    },
    clearSubGroupContainer: {
        marginTop: 16,
    },
    goBackButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    }
});

export default Verification;
