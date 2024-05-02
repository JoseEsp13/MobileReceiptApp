/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Block, Line, ITextRecognitionResponse, Rect} from './mlkit';
import { ScrollView } from 'react-native-gesture-handler';

interface IViewDictionaryProps {
  response?: ITextRecognitionResponse;
}

export const ViewDictionary = (props: IViewDictionaryProps) => {

  if (!props.response) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>No dictionary to show</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, width: "100%"}}>
      <Text>{"{"}</Text>
      {props.response?.blocks.map((block, bIdx) => (
        <View key={bIdx}>
          <Text style={{paddingLeft: 10}}>{`# Block ${bIdx}`}</Text>
          <Text style={{paddingLeft: 10}}>{`${bIdx}: {`}</Text>
          
          <View style={{flexDirection: "row", paddingLeft: 20}}>
            <Text style={{fontWeight: "600"}}>Text: </Text>
            <Text>{block.text}</Text>
          </View>
          <View style={{flexDirection: "row", paddingLeft: 20}}>
            <Text style={{fontWeight: "600"}}>Lines: </Text>
            <Text>{"{"}</Text>
          </View>
          <LineComponent lines={block.lines} />
          <Text style={{paddingLeft: 20}}>{"}"}</Text>

          <Text style={{paddingLeft: 10}}>{"}"}</Text>
        </View>
      ))}
      <Text>{"}"}</Text>
    </ScrollView>
  );
};

interface IRectComponent {
  rect: Rect
}

const RectComponent = (props: IRectComponent) => {
  return (
    <>
      <Text style={{paddingLeft: 20}}>{`H: ${props.rect.height}; W: ${props.rect.width}, T: ${props.rect.top}; L: ${props.rect.left}`}</Text>
      {/*<Text>{`Width: ${props.rect.width}`}</Text>
      <Text>{`Top: ${props.rect.top}`}</Text>
  <Text>{`Left: ${props.rect.left}`}</Text>*/}
    </>
  )
}

interface ILineComponent {
  lines: Line[]
}

const LineComponent = (props: ILineComponent) => {
  return props.lines.map((line, idx) => (
    <View key={idx} style={{paddingLeft: 30}}>
      <Text>{`${idx}: {`}</Text>
      <Text style={{paddingLeft: 10}}>{`"${line.text}"`}</Text>
      <Text>{"}"}</Text>
    </View>
  ))
}
