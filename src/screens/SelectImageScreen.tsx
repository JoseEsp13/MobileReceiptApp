/**
 * SelectImageScreen.tsx
 * 
 * Displays buttons for capturing an image or selecting one from the gallery.
 */
import React, { useMemo } from 'react';
import {View, SafeAreaView, Image, StyleSheet, useWindowDimensions, ScrollView, Text} from 'react-native';
import {DemoButton} from '../components/ui';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import routes from '../routes';


export const SelectImageScreen = () => {
  /*const {height} = useWindowDimensions();
  const [response, setResponse] = React.useState<ImagePickerResponse | null>(null);

  const onButtonPress = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);*/
  //
  // React.useEffect(() => {
  //   if (response) {
  //     navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
  //       uri: response?.assets?.[0]?.uri!!,
  //     });
  //   }
  // }, [response, navigation]);

  /*const onProcessImage = () => {
    if (response) {
      props.navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
        uri: response?.assets?.[0]?.uri!!,
      });
    }
  };

  const aspectRatio = useMemo(() => {
    if (response?.assets && response.assets[0] && response.assets[0].width && response.assets[0].height) {
      return response.assets[0].width / response.assets[0].height
    }
    return undefined;
  }, [response]);*/

  return (
    <View></View>
  )

  /*return (
    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
      {response?.assets ?
        <ScrollView style={{flex: 1}}>
          {response.assets[0] &&   
            <Image
              resizeMode="contain"
              resizeMethod="auto"
              style={{width: '100%', height: undefined, aspectRatio: aspectRatio}}
              source={{uri: response.assets[0].uri}}
            />
          }          
        </ScrollView>
        :
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text>Select an image to display</Text>
        </View>
      }
      <View style={{flexDirection: 'row', paddingVertical: 8}}>
        <DemoButton
          key="Take Image"
          onPress={() =>
            onButtonPress('capture', {
              saveToPhotos: true,
              mediaType: 'photo',
              includeBase64: false,
            })
          }>
          {'Take Image'}
        </DemoButton>
        <DemoButton
          key="Select Image"
          onPress={() =>
            onButtonPress('library', {
              selectionLimit: 0,
              mediaType: 'photo',
              includeBase64: false,
            })
          }>
          {'Select Image'}
        </DemoButton>
      </View>
      <View style={{flexDirection: 'row', paddingBottom: 8}}>
        <DemoButton key="Process Image" onPress={onProcessImage}>
          {'Process Image'}
        </DemoButton>
      </View>
    </SafeAreaView>
  );*/
};
