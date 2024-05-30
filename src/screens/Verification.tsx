import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TextStyle, ViewStyle, SafeAreaView } from 'react-native';
import { IParserResult } from '../parsers/IParser';

interface VerificationProps {
    parserResult: IParserResult;
}

interface InputValidity {
    [key: string]: boolean | undefined;
}

const Verification: React.FC<VerificationProps> = ({ parserResult }: VerificationProps) => {
    const [itemNames, setItemNames] = useState<IParserResult>(parserResult);
    const [inputValidity, setInputValidity] = useState<InputValidity>({});

    const handleTextChange = (text: string, key: string): void => {
        const priceFloat: RegExp = /^[0-9]*(\.[0-9]{0,2})?$/;
        if (priceFloat.test(text)) {
            setItemNames((prevItemNames: IParserResult) => {
                const updatedItemNames: IParserResult = { ...prevItemNames };
                updatedItemNames[key] = parseFloat(text); // Convert text to a number
                return updatedItemNames;
            });
            setInputValidity((prevValidity: InputValidity) => ({
                ...prevValidity,
                [key]: true,
            }));
        } else {
            setInputValidity((prevValidity: InputValidity) => ({
                ...prevValidity,
                [key]: false,
            }));

            // Reset the invalid input state after 1 second
            setTimeout(() => {
                setInputValidity((prevValidity: InputValidity) => {
                    const updatedValidity: InputValidity = { ...prevValidity };
                    updatedValidity[key] = undefined; // Reset the validity state to undefined
                    return updatedValidity;
                });
            }, 1000);
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        {Object.keys(itemNames).map((key: string) => (
                            <View key={key} style={styles.item}>
                                <TextInput
                                    style={[styles.input, inputValidity[key] === false && styles.invalidInput]}
                                    value={key}
                                    editable={true}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={styles.column}>
                        {Object.keys(itemNames).map((key: string) => (
                            <View key={key} style={styles.item}>
                                <TextInput
                                    style={[styles.input, inputValidity[key] === false && styles.invalidInput]}
                                    value={itemNames[key].toString()}
                                    onChangeText={(text) => handleTextChange(text, key)}
                                    keyboardType="numeric"
                                />
                            </View>
                        ))}
                    </View>
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
    column: ViewStyle;
    item: ViewStyle;
    input: TextStyle;
    invalidInput: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    scrollContainer: {
        flex: 1,
    },
    container: {
        marginTop: 8,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
    item: {
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: 'coral',
        backgroundColor: 'oldlace'
    },
    invalidInput: {
        borderColor: 'red',
    },
    
});

export default Verification;