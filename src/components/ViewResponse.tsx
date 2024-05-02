/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Block, Line, ITextRecognitionResponse} from './mlkit';

interface IViewResponseProps {
  response?: ITextRecognitionResponse;
}

export const ViewResponse = (props: IViewResponseProps) => {

  if (!props.response) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>No dictionary to show</Text>
      </View>
    )
  }

  return (
    <>
      {props.response?.blocks.map((block) => {
        return block.lines.map((line, index) => {
          return (
            <Text key={index} style={{color: "black"}}>{line.text}</Text>
          );
        });
      })}
    </>
  );
};
