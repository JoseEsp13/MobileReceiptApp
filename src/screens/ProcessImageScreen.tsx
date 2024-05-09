/**
 * ProcessImageScreen.tsx
 * 
 * Runs the image through ML Kit. Processes the response.
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {ProcessImageNavigationProps, ProcessImageRouteProps} from '../Navigator';
import { ITextRecognitionResponse, recognizeImage } from '../components/mlkit';
import { ViewOverlay } from '../components/ViewOverlay';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ViewDictionary } from '../components/ViewDictionary';
import { ViewReceipt } from '../components/ViewReceipt';
import { ViewResponse } from '../components/ViewResponse';
import ViewGroups from "../components/ViewGroups";
import { groupNames } from './GroupsScreen';
import parser from '../parsers/parser';

// Tab routing type
interface RenderSceneRoute {
  route: {key: string},
  jumpTo: (tab: string) => void,
}

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

export const ProcessImageScreen = (props: ProcessImageScreenProps) => {
  const windowDimensions = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState(1);

  // Tab routing
  const [tabIndex, setTabIndex] = React.useState(0);
  const [tabRoutes] = React.useState([
    { key: 'receipt', title: "Receipt" },
    { key: 'overlay', title: "Overlay" },
    { key: 'simple', title: "Simple" },
    { key: 'dictionary', title: "Dict" },
    { key: 'Groups', title: "Groups"}
  ]);

  const [response, setResponse] = useState<ITextRecognitionResponse | undefined>();

  const uri = props.route.params.uri

  useEffect(() => {
    if (uri) {
      console.log()
      processImage(uri);
    }
  }, [uri]);

  // Tab routing
  const renderScene = useCallback((params: RenderSceneRoute) => {
    switch (params.route.key) {
      case 'receipt':
        return <ViewReceipt response={response} uri={uri} />
      case 'overlay':
        return <ViewOverlay response={response} uri={uri}/>
      case 'simple':
        return <ViewResponse response={response} />
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
          response_img = await recognizeImage(url);
          // If the response contains data
          if (response_img?.blocks?.length > 0) {

            // Process response here
            setResponse(response_img);                            // Save the response
            setAspectRatio(response_img.height / response_img.width); // Set the aspect ratio of the returned data 

            // TO DO: What else do we want to do with the ML Kit response?
            // console.log(getStore(response))
            // console.log(isPrice("4.43"))
            let dict = parser.parseOutput(response_img, setResponse)
            // console.log(dict)
            if (dict != undefined) {
              console.log(parser.checksum(dict))
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