import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TextStyle, ViewStyle, Text, Button } from 'react-native';
import { IParserResult } from '../parsers/IParser';

interface VerificationProps {
    parserResult: IParserResult;
    numberOfButtons: number; // Specify the number of buttons
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


const Verification: React.FC<VerificationProps> = ({ parserResult, numberOfButtons }: VerificationProps) => {
    // Explicitly type the initial entries
    const initialEntries: [string, string][] = Object.entries(parserResult).map(([key, value]) => [key, value.toString()]);

    const [itemEntries, setItemEntries] = useState<[string, string][]>(initialEntries);
    const [totalSum, setTotalSum] = useState<number>(calculateTotalSum(initialEntries));

    useEffect(() => {
        setTotalSum(calculateTotalSum(itemEntries));
        // Update the TOTAL key in parserResult
        parserResult.TOTAL = parseFloat(totalSum.toFixed(2));
    }, [itemEntries]);

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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {itemEntries.map(([key, value], index) => {
                    if (key !== "TOTAL") {
                        return (
                            <View key={index} style={styles.row}>
                                <View style={styles.item}>
                                    <TextInput
                                        style={styles.input}
                                        value={key}
                                        onChangeText={(text) => handleKeyChange(text, index)}
                                        editable={true}
                                    />
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => handleValueChange(text, index)}
                                        keyboardType="default"
                                    />
                                </View>
                            </View>
                        );
                    }
                    return null; // Don't render the TOTAL key
                })}
                <View style={styles.row}>
                    <View style={styles.item}>
                        <Text style={styles.title}>TOTAL:</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>{totalSum.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {[...Array(numberOfButtons)].map((_, index) => (
                        <View key={index} style={styles.circularButton}>
                            <Button title={`Button ${index + 1}`} onPress={() => console.log(`Button ${index + 1} pressed`) }/>
                        </View>

                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

interface Styles {
    scrollContainer: ViewStyle;
    container: ViewStyle;
    title: TextStyle;
    row: ViewStyle;
    item: ViewStyle;
    input: TextStyle;
    buttonContainer: ViewStyle;
    circularButton: ViewStyle;
}

// Styling for the text boxes and rows
const styles = StyleSheet.create<Styles>({
    scrollContainer: {
        flexGrow: 1,
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
        color: 'coral',
        backgroundColor: 'oldlace'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    circularButton: {
        width: 50, // Adjust width as needed
        height: 50, // Adjust height as needed
        borderRadius: 25, // Half of width/height to make it circular
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue', // Example background color
        overflow: 'hidden', // Ensure the button is clipped to be circular
    },
});


export default Verification;
