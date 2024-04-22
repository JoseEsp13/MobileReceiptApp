/**
 * ProcessImageScreen.tsx
 * 
 * Runs the image through ML Kit. Processes the response.
 */
import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {ProcessImageNavigationProps, ProcessImageRouteProps} from '../Navigator';
import { ITextRecognitionResponse, recognizeImage } from '../components/mlkit';
import { ResponseRenderer } from '../components/ResponseRenderer';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}


export const ProcessImageScreen = (props: ProcessImageScreenProps) => {
  const {width: windowWidth} = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [response, setResponse] = useState<ITextRecognitionResponse | undefined>();
  const uri = props.route.params.uri;

  useEffect(() => {
    if (uri) {
      processImage(uri);
    }
  }, [uri]);

  // Main logic for reading a receipt is here
  const processImage = async (url: string) => {
    if (url) {
      try {
        // Send a request to Google's ML Kit
        const response = await recognizeImage(url);

        // If the response contains data
        if (response?.blocks?.length > 0) {

          // Process response here
          setResponse(response);                            // Save the response
          setAspectRatio(response.height / response.width); // Set the aspect ratio of the returned data 

          // TO DO: What else do we want to do with the ML Kit response?

        }
    } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      {!response && 
        <Image
          source={{uri}}
          style={{width: windowWidth, height: windowWidth * aspectRatio}}
          resizeMode="cover"
        />
      }
      {
        !!response && <ResponseRenderer response={response} scale={windowWidth / response.width} windowWidth={windowWidth} aspectRatio={aspectRatio} />
      }
    </ScrollView>
  );
};