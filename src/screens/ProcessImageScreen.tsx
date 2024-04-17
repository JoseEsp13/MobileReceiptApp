import React, {useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {
  ProcessImageNavigationProps,
  ProcessImageRouteProps,
} from '../navigation/Navigator';
import { ITextRecognitionResponse, recognizeImage } from '../components/mlkit';
import { ResponseRenderer } from '../components/ResponseRenderer';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

export const ProcessImageScreen = ({route}: ProcessImageScreenProps) => {
  const {width: windowWidth} = useWindowDimensions();
  const [aspectRatio, setAspectRation] = useState(1);
  const [response, setResponse] = useState<ITextRecognitionResponse | undefined>();
  const [hasProcessed, setHasProcessed] = useState(false);
  const uri = route.params.uri;

  useEffect(() => {
    if (uri) {
      processImage(uri);
    }
  }, [uri]);

  const processImage = async (url: string) => {
    if (url) {
      try {
        setHasProcessed(false);
        const response = await recognizeImage(url);
        console.log(response);
        if (response?.blocks?.length > 0) {
          setResponse(response);
          setAspectRation(response.height / response.width);
          setHasProcessed(true);
        }
    } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      {!hasProcessed && 
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