import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {DemoButton, DemoResponse} from '../components/ui';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {SelectScreenNavigationProps} from '../navigation/Navigator';

import * as routes from '../navigation/routes';

type SelectImageScreenProps = {
  navigation: SelectScreenNavigationProps;
};

export const SelectImageScreen = ({navigation}: SelectImageScreenProps) => {
  const {height, width} = useWindowDimensions();
  const [response, setResponse] = React.useState<ImagePickerResponse | null>(null);

  const onButtonPress = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);
  //
  // React.useEffect(() => {
  //   if (response) {
  //     navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
  //       uri: response?.assets?.[0]?.uri!!,
  //     });
  //   }
  // }, [response, navigation]);

  const onProcessImage = () => {
    if (response) {
      navigation.navigate(routes.PROCESS_IMAGE_SCREEN, {
        uri: response?.assets?.[0]?.uri!!,
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', paddingBottom: 8}}>
        <DemoButton key="Process Image" onPress={onProcessImage}>
          {'Process Image'}
        </DemoButton>
      </View>
      <View style={{flexDirection: 'row', paddingTop: 8}}>
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
      {/*<View style={{paddingHorizontal: 8}}>
        <DemoResponse>{response}</DemoResponse>
        </View>*/}
      <View style={{flex: 1}}>
        {response?.assets &&
          <ScrollView style={styles.scrollView}>
            {response.assets[0] &&   
              <Image
                resizeMode="center"
                resizeMethod="auto"
                style={{width: '100%', height: height}}
                source={{uri: response.assets[0].uri}}
              />
            }          
          </ScrollView>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%'
  }
});