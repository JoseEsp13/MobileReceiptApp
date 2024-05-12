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
import { groupNames } from './GroupsScreen';
import parser from '../parsers/parser';
import { testChecksum } from '../parsers/ctests';
import { IProcessImageDrawerProps, IProcessImageRouteProps } from '../routes';
import { IParserResult } from '../parsers/IParser';

// Tab routing type
interface RenderSceneRoute {
  route: {key: string},
  jumpTo: (tab: string) => void,
}

interface ProcessImageScreenProps {
  navigation: IProcessImageDrawerProps;
  route: IProcessImageRouteProps;
}

export const ProcessImageScreen = (props: ProcessImageScreenProps) => {
  const windowDimensions = useWindowDimensions();

  // Tab routing
  const [tabIndex, setTabIndex] = React.useState(0);
  const [tabRoutes] = React.useState([
    { key: 'receipt', title: "Receipt" },
    { key: 'overlay', title: "Overlay" },
    { key: 'dictionary', title: "Dict" },
    { key: 'Groups', title: "Groups"}
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
      case 'receipt':
        return <ViewReceipt response={response} uri={uri} />
      case 'overlay':
        return <ViewOverlay response={response} uri={uri}/>
      case 'dictionary':
        return <ViewDictionary response={response} />
      case 'Groups':
        return <ViewGroups groupNames={groupNames}/>
    }
  }, [response, uri]);

  // Main logic for reading a receipt is here
  const processImage = async (url: string) => {
    if (url) {
      try {
        // Send a request to Google's ML Kit
        let response_img;
        if (!response) {
          response_img = await MLKit.recognizeImage(url);
          // If the response contains data
          if (response_img?.blocks?.length > 0) {

            // Process response here
            setResponse(response_img);

            // TO DO: What else do we want to do with the ML Kit response?
            const dict = await parser.parseOutput(response_img, setResponse)
            // console.log(dict)
            if (dict != undefined) {
              console.log(parser.checksum(dict))
              setParserResult(dict);
            }
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