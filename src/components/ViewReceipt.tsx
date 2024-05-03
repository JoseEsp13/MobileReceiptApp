/**
 * ResponseRenderer.tsx
 * 
 * Currently not used
 */
import React from 'react';
import {StyleSheet, View, Text, ScrollView, Image, useWindowDimensions} from 'react-native';
import {Block, Line, ITextRecognitionResponse} from './mlkit';

interface IViewReceiptProps {
  response?: ITextRecognitionResponse;
  uri: string | undefined
}

export const ViewReceipt = (props: IViewReceiptProps) => {

  const wd = useWindowDimensions();
  const aspectRatio = props.response ? props.response.height / props.response.width : 0;
  //   scale={wd.width / response.width} windowWidth={windowDimensions.width} aspectRatio={response.height / response.width}
  
  if (!props.uri) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>No image found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1}}>
      <Image
        source={{uri: props.uri}}
        style={{width: wd.width, height: wd.width * aspectRatio}}
        resizeMode="cover"
      />
    </ScrollView>
  );
};
