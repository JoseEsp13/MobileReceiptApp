/**
 * ProcessImageScreen.tsx
 * 
 * Runs the image through ML Kit. Processes the response.
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import MLKit, { ITextRecognitionResponse } from '../components/mlkit';
import { ViewOverlay } from '../components/ViewOverlay';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ViewDictionary } from '../components/ViewDictionary';
import { ViewReceipt } from '../components/ViewReceipt';
import { ViewResponse } from '../components/ViewResponse';
import ViewGroups from "../components/ViewGroups";
import ViewParserResult from '../components/ViewParserResult';
import { groupNames } from './GroupsScreen';
import parseTools from '../parsers/parserTools';
import parser from '../parsers/parser';
import { testChecksum } from '../parsers/ctests';
import { IProcessImageRouteProps } from '../routes';
import { IParserResult } from '../parsers/IParser';
import { IHomeStackParamList } from '../components/nav_stacks/HomeStackScreen';

// Tab routing type
interface RenderSceneRoute {
  route: {key: string},
  jumpTo: (tab: string) => void,
}

interface ProcessImageScreenProps {
  navigation: IHomeStackParamList;
  route: IProcessImageRouteProps;
}


export const ProcessImageScreen = (props: ProcessImageScreenProps) => {
  const windowDimensions = useWindowDimensions();

  // Tab routing
  const [tabIndex, setTabIndex] = React.useState(0);
  const [tabRoutes] = React.useState([
    { key: 'overlay', title: "Overlay" },
    { key: 'dictionary', title: "Dict" },
    { key: 'parser', title: "Parser" },
    { key: 'groups', title: "Groups"}
  ]);

  const [response, setResponse] = useState<ITextRecognitionResponse | undefined>();
  const [parserResult, setParserResult] = useState<IParserResult | undefined>();

  const uri = props.route.params.uri

  useEffect(() => {
    if (uri) processImage(uri);
  }, [uri]);

  // Tab routing
  const renderScene = useCallback((params: RenderSceneRoute) => {
    switch (params.route.key) {
      case 'overlay':
        return <ViewOverlay response={response} uri={uri}/>
      case 'dictionary':
        return <ViewDictionary response={response} />
      case 'parser':
        return <ViewParserResult parserResult={parserResult} />
      case 'groups':
        return parserResult ? <ViewGroups groupNames={groupNames} dict={parserResult} /> : null;
    }
  }, [response, uri, parserResult]);

  // Main logic for reading a receipt is here
  const processImage = async (url: string) => {
    if (url) {
      try {
        // Send a request to Google's ML Kit
        let response_img;
        response_img = await MLKit.recognizeImage(url);
        // If the response contains data
        if (response_img?.blocks?.length > 0) {

          // Process response here
          setResponse(response_img);

          // TO DO: What else do we want to do with the ML Kit response?
          const parserResult = await parser.parseOutput(response_img, url)
          if (parserResult != undefined) {
            console.log(parseTools.checksum(parserResult))
            setParserResult(parserResult);
          }
        }
    } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <TabView
      navigationState={{index: tabIndex, routes: tabRoutes}}
      renderScene={renderScene}
      onIndexChange={setTabIndex}
      initialLayout={{width: windowDimensions.width}}
    />
  );
};