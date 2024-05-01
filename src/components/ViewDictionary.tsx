/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Block, Line, ITextRecognitionResponse} from './mlkit';

interface IViewDictionaryProps {
  response?: ITextRecognitionResponse;
}

export const ViewDictionary = (props: IViewDictionaryProps) => {
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

type BlockProps = {
  block: Block | Line;
  scale: number;
};

export const BlockComponent = ({block, scale}: BlockProps) => {
  const rect = {
    top: block.rect.top * scale,
    width: block.rect.width * scale,
    left: block.rect.left * scale,
    height: block.rect.height * scale,
  };

  return (
    <View
      style={{
        position: 'absolute',
        ...rect,
        borderWidth: 1,
        borderColor: 'red',
      }}>
      <Text style={{color: 'blue'}}>{block.text}</Text>
    </View>
  );
};
