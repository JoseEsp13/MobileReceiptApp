/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React, { useMemo } from 'react';
import {StyleSheet, View, Text, useWindowDimensions, Image} from 'react-native';
import {Block, Line, ITextRecognitionResponse} from './mlkit';
import { ScrollView } from 'react-native-gesture-handler';

interface ResponseRendererProps {
  response?: ITextRecognitionResponse;
  uri: string
}

export type Size = {
  width: number;
  height: number;
};

export const ViewOverlay = (props: ResponseRendererProps) => {

  const wd = useWindowDimensions();
  const aspectRatio = props.response ? props.response.height / props.response.width : 0;

  const scale = useMemo(() => {
    if (props.response?.width) {
      return wd.width / props.response.width
    }
    return 1;
  }, [wd.width, props.response?.width]);

  if (!props.response) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Select an image</Text>
      </View>
    )
  }

  return (
      <ScrollView style={{flex: 1 }}>
        <Image
          source={{uri: props.uri}}
          style={{width: wd.width, height: wd.width * aspectRatio}}
          resizeMode="cover"
        />
        {props.response.blocks.map(block => (
          block.lines.map((line, index) => (
            <BlockComponent line={line} scale={scale} key={index} />
          ))
        ))}
      </ScrollView>
  );
};

type BlockProps = {
  line: Line;
  scale: number;
};

const BlockComponent = ({line, scale}: BlockProps) => {
  const rect = {
    top: line.rect.top * scale,
    width: line.rect.width * scale,
    left: line.rect.left * scale,
    height: line.rect.height * scale,
  };

  return (
    <View
      style={{
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'red',
        ...rect,
      }}>
      <Text style={{color: "blue"}}>{line.text}</Text>
    </View>
  );
};
