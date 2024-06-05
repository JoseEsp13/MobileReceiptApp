import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Button, Animated, TouchableOpacity } from 'react-native';
import { IParserResult } from '../parsers/IParser';
import AwesomeButton, { ThemedButton } from "react-native-really-awesome-button";
import useAppContext from '../components/hooks/useAppContext';
import { IContact, IGroup } from '../components/state/IFirebaseDocument';
import { configureLayoutAnimationBatch } from 'react-native-reanimated/lib/typescript/reanimated2/core';
import { isColor } from 'react-native-reanimated';

interface VerificationProps {
    parserResult: IParserResult;
}

/* Calculates the total count of each item across the entire memberDict, and returns a dictionary containing said count
*/
export const getCountOfItems = (memberDict: {[member: string]: {[key: string]: number}}): {[item: string]: number} => {
    let itemCountDict: {[item: string]: number} = {};
    
    for (let member in memberDict) {
        let itemDict = memberDict[member] // item dictionary for an individual member
        for (let item in itemDict) {
            if (item in itemCountDict) {
                itemCountDict[item] = itemCountDict[item] + 1
            } else {
                itemCountDict[item] = 1
            }
        }
    }
    return itemCountDict;
}

/* Function to calculate the amount each member should pay
 * @param dict: A dictionary containing the names of the members and their respective items and prices
 * Is a dictionary containing names of members as keys and a dictionary of {item_name, item_price} as value
 * For every member in the dict, take their respective dict and sum the prices/values of all the items and assign to the member
 */ 
export const memberSums = (memberDict: {[member: string]: {[key: string]: number}}): {[member: string]: number} => {
    // final dictionary containing member and their respective total to be returned
    let outDict: {[member: string]: number} = {};
    // if the price passed for each item is not split already:
    let itemCountDict = getCountOfItems(memberDict);
    
    let itemsThatDontSplit: {[item: string]: number} = {}

    for (let member in memberDict) {
        let memberTotal = 0;
        let itemDict = memberDict[member];
        // fore each item in itemDict, memberTotal += item's price / item's count
        for (let item in itemDict) {
            let modCents = (Math.round(itemDict[item] * 100)) % itemCountDict[item]
            if (modCents != 0) {
                if (!itemsThatDontSplit.hasOwnProperty(item)) {
                    itemsThatDontSplit[item] = modCents
                }
                let current = (Math.trunc((itemDict[item] / itemCountDict[item]) * 100) / 100)
                // console.log("modCents = " + String(modCents) + " and current= " + current)
                
                if (itemsThatDontSplit[item] > 0) {
                    memberTotal += current + .01
                    itemsThatDontSplit[item] -= 1;
                } else {
                    memberTotal += current
                }
                
            } else {
                memberTotal += Number((itemDict[item] / itemCountDict[item]).toFixed(2));
            }
        }
        outDict[member] = Number(memberTotal.toFixed(2));
    }
    // total = SUM(memberDict[member][item]/itemCountDict[item])
    return outDict
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

const initializeDefaultDict = (group: IGroup): { [key: string]: any } => {
    return group.contacts.reduce((acc, contact) => {
        acc[contact.name] = null; // Set default value to null or any other value you prefer
        return acc;
    }, {} as { [key: string]: any });
};

let MASTERDICT: {[name: string]: string} = {}

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
    const [addedItems, setAddedItems] = useState<{ [contact: string]: { [itemName: string]: number } }>({}); // Track added items for each subgroup
    const [addedItemsHistory, setAddedItemsHistory] = useState<{ [contactName: string]: { [itemName: string]: number } }[]>([]);
    const [defaultDict, setDefaultDict] = useState<{[key: string]: any}>({}); // New state for the default dictionary
    const [activeUser, setActiveUser] = useState<IContact>();
    const [memberTotal, setMemberTotal] = useState<{ [key: string]: string }>({}); // contains the actual member totals

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
            const defaultDict = initializeDefaultDict(selectedGroup);
            setDefaultDict(defaultDict);
            console.log("Updated Default Dictionary:", defaultDict); // Add this line to log the new dictionary
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
            const currentAddedItems = { ...addedItems[clickedSubGroup] } || {}; // Clone the current dictionary to avoid mutating the state directly
            // console.log('printing currentAddedItems')
            // console.log(currentAddedItems)

            if (currentAddedItems[key]) {
                newValue = (currentValue - currentAddedItems[key]).toFixed(2); // Subtract the value if already added
                delete currentAddedItems[key];
            } else {
                newValue = (currentValue + itemValue).toFixed(2); // Add the value if not added
                currentAddedItems[key] = itemValue;
            }
            console.log("Newvalue = " + newValue)

            // Log the currentAddedItems for debugging
            console.log('Current Added Items:', currentAddedItems);
            //resetSubGroupValues()

            // Update the addedItems state
            setAddedItems((prevAddedItems) => ({
                ...prevAddedItems,
                [clickedSubGroup]: currentAddedItems
            }));
            

            newValue = resetSubGroupValues(clickedSubGroup, currentAddedItems)[clickedSubGroup]
            
            // Store the currentAddedItems in the addedItemsHistory state
            setAddedItemsHistory((prevHistory) => ({
                ...prevHistory,
                [clickedSubGroup]: currentAddedItems
            }));
            

                return {
                    ...prevValues,
                    [clickedSubGroup]: newValue
                };
            });

        }
        
    };

    const resetSubGroupValues = (clickedSubGroup: string, toAdd: { [x: string]: number; }): {[name: string]: string} => {
        let inputDict = addedItems
        inputDict[clickedSubGroup] = toAdd
        
        let memberDict = memberSums(inputDict)
        // console.log("BEANSSSSSS")
        // console.log(addedItems)
        // console.log(memberDict)
        let memberDictString: {[name: string]: string} = {}
        for (let member in memberDict) {
            memberDictString[member] = String(memberDict[member])
        }
        setSubGroupValues(memberDictString)
        MASTERDICT = memberDictString
        return memberDictString
    }
    
    

    const handleSubGroupClick = (contact: IContact): void => {
        const subGroupName = contact.name;
        console.log(`Clicked subgroup: ${subGroupName}`);
        setClickedSubGroup(subGroupName);
        setActiveUser(contact);
        finalize();
        // Append currentAddedItems values to respective subgroup
        /*
        if (clickedSubGroup && addedItems[clickedSubGroup]) {
            const updatedValues = { ...subGroupValues };
            for (const itemName in addedItems[clickedSubGroup]) {
                if (addedItems[clickedSubGroup].hasOwnProperty(itemName)) {
                    const itemValue = addedItems[clickedSubGroup][itemName];
                    const currentValue = parseFloat(updatedValues[subGroupName] || '0');
                    const newValue = (currentValue + itemValue).toFixed(2);
                    updatedValues[subGroupName] = newValue;
                }
            }
            setSubGroupValues(updatedValues);
            console.log("Updated Default Dictionary:", updatedValues); // Add this line to log the updated default dictionary
        }
        */
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
        setEditable(false); // Set editable to false to disable all TextInput fields
        setIsFinalized(true); // Set the editing finalized state to true
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

    const invertColor = (hex: string): string => {
        const color = parseInt(hex.replace('#', ''), 16);
        const invertedColor = 0xffffff - color;
        const invertedHex = invertedColor.toString(16);
        return `#${invertedHex.padStart(6, '0')}`;
    }

    const handleBackgroundColor = (key: string) => {
        if (activeUser && addedItems[activeUser.name]) {
            // console.log(addedItems[activeUser.name]);
            if (key in addedItems[activeUser.name]) {
                return activeUser.bgColor;
            }
        }
        return undefined;
    }

    const handleTextColor = (key: string) => {
        if (activeUser && addedItems[activeUser.name]) {
            if (key in addedItems[activeUser.name]) {
                return invertColor(activeUser.bgColor);
            }
        }
        return '#1f91ec';
    }

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
                                <TouchableOpacity 
                                    onPress={() => handleItemClick(key, value)} 
                                    style={{ width: '100%' }}>
                                    <Text style={{
                                        ...styles.input,
                                        backgroundColor: handleBackgroundColor(key),
                                        textAlignVertical: 'center',
                                        color: handleTextColor(key)
                                    }}>{`${key}: ${value}`}</Text>
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
                <View style={styles.panelButtonContainer}>
                    <Button title="Group" onPress={() => setIsPanelVisible(true)} />
                </View>
                {selectedGroup && (
                    <View style={styles.chosenGroup}>
                        <Text style={styles.chosenGroupText}>{selectedGroup.name}</Text>
                    </View>
                )}
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
                                onPress={() => handleSubGroupClick(contact)}
                            >
                                <Text style={styles.subGroupText}></Text>
                            </ThemedButton>
                            <Text style={styles.subGroupText}>
                                {contact.name}: ${MASTERDICT[contact.name] || '0'}
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
                                    <Text style={styles.subGroupText}>{subGroupValues[key]}</Text>
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
        paddingHorizontal: 8,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1,
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