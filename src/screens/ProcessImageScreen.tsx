/**
 * ProcessImageScreen.tsx
 * 
 * Runs the image through ML Kit. Processes the response.
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView, Text} from 'react-native';
import MLKit, { ITextRecognitionResponse } from '../components/mlkit';
import { ViewOverlay } from '../components/ViewOverlay';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ViewDictionary } from '../components/ViewDictionary';
import { ViewReceipt } from '../components/ViewReceipt';
import { ViewResponse } from '../components/ViewResponse';
import ViewGroups from "../components/ViewGroups";
import ViewParserResult from '../components/ViewParserResult';
import parseTools from '../parsers/parserTools';
import parser from '../parsers/parser';
import { testChecksum } from '../parsers/ctests';
import { IProcessImageRouteProps } from '../routes';
import { IParserResult } from '../parsers/IParser';
import { IHomeStackParamList } from '../components/nav_stacks/HomeStackScreen';
import Verification from './Verification';
import { SafeAreaView } from 'react-native-safe-area-context';
import { testGetCountOfItems, testGenMemberSums } from './TestOutput.ts';

interface ProcessImageScreenProps {
  navigation: IHomeStackParamList;
  route: IProcessImageRouteProps;
}

export const ProcessImageScreen = (props: ProcessImageScreenProps) => {

  const [response, setResponse] = useState<ITextRecognitionResponse | undefined>();
  const [parserResult, setParserResult] = useState<IParserResult | undefined>();

  useEffect(() => {
    if (props.route.params.uri)
      processImage(props.route.params.uri);
  }, [props.route.params.uri]);

  // Main logic for reading a receipt is here
  const processImage = async (url: string) => {
    if (url) {
      try {
        // run a test here:
        // console.log(testGenMemberSums(10))
        // console.log(testGetCountOfItems(10))
        // console.log(testChecksum(10))

        // Send a request to Google's ML Kit
        const response_img = await MLKit.recognizeImage(url);
        // If the response contains data
        if (response_img?.blocks?.length > 0) {

          // Process response here
          setResponse(response_img);

          // TO DO: What else do we want to do with the ML Kit response?
          const parserResult = await parser.parseOutput(response_img, url)
          if (parserResult != undefined) {
            setParserResult(parserResult);
          }
        }
    } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {parserResult && <Verification parserResult={parserResult}/>}
    </SafeAreaView>
  );
};
