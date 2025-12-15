/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React from 'react';
import {View, Text} from 'react-native';
import {Line, ITextRecognitionResponse, Rect} from './mlkit';
import { ScrollView } from 'react-native-gesture-handler';
import { IParserResult } from '../parsers/IParser';

interface IParserResultProps {
  parserResult?: IParserResult;
}

export default function ViewParserResult(props: IParserResultProps) {

  const parserResult = props.parserResult;

  if (!parserResult) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>No parser results to show</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, width: "100%"}}>
      <Text style={{color: "#000"}}>{"{"}</Text>
      {Object.keys(parserResult).map((key, i) => (
        <View key={i} style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text>{`"${key}":`}</Text>
          <Text>{`${parserResult[key]}`}</Text>
        </View>
      ))}
      <Text style={{color: "#000"}}>{"}"}</Text>
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
      <Text style={{color: "#000"}}>{`${idx}: {`}</Text>
      <Text style={{paddingLeft: 10, color: "#000"}}>{`"${line.text}"`}</Text>
      <Text style={{color: "#000"}}>{"}"}</Text>
    </View>
  ))
}
