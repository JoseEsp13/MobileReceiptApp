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
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

interface ProcessImageScreenProps {
  navigation: ProcessImageNavigationProps;
  route: ProcessImageRouteProps;
}

function getStore(response: ITextRecognitionResponse): string | undefined {
  // Takes response and returns the first result without whitespace or periods in lowercase for matching
  var store = response.blocks.at(0)?.lines[0].text.replace(/\s/g, "").toLowerCase();
  store = store?.replace(/\./g, "")
  return matchStore(store)
};

function matchStore(store_in: string | undefined): string | undefined {
  // Takes a string store (obtained from getStore) and returns the matched store
  if (store_in == undefined) {
    return undefined
  }
  const re_costco = new RegExp(".*costco.*|.*cost.*|.*cos.*|.*ostc.*", "g")
  const re_safeway = new RegExp(".*safeway.*|.*safe.*|.*fewa.*", "g")
  const re_stores = [re_costco, re_safeway]
  const stores = ["costco", "safeway"]
  var i = 0
  var store_index = undefined
  for (var re of re_stores) {
    if (store_in.match(re)) {
      store_index = i
    }
    i = i + 1
  }
  if (store_index == undefined) {
    return undefined
  }
  return stores[store_index]
}

function isPrice(price: string): boolean {
  // checks if a string matches to a price with a decimal and two digits
  const re_price = /^\d+\.\d{2}$/;
  return re_price.test(price);
};

function isDiscount(price: string): boolean {
  // checks if a string matchs a price with a minus sign at the end to indicate discount
  const re_discount = /^\d+\.\d{2}-$/;
  return re_discount.test(price);
}

function isTotal(str: string): boolean {
  // checks if a string matches **** Total
  const re_total = /^\*+ TOTAL$/;
  return re_total.test(str);
};

function strClean(str: string): string {
  // takes a string and removes leading numbers and spaces
  var split_by_space = str.split(' ');
  const re_nums = /^\d*$/;
  var out = ""
  for (var i in split_by_space) {
    if (re_nums.test(split_by_space[i]) == false) {
      out = out + ' ' + split_by_space[i];
    }
  }
  return out.trim()
}

function parseOutput(response: ITextRecognitionResponse): Object {
  var store_name = getStore(response)
  if (store_name == "costco") {
    return parseCostco(response)
  }
  return Object
  if (store_name == "safeway") {
    // return parseSafeway(response)
  }
};

function parseCostco(response: ITextRecognitionResponse): Object {
  const item_dict: {[key: string]: Float} = {};
  var num_prices = -2
  var prices = []
  var total_ind = 0
  var total_hit = false
  var to_deduct = 0
  var deducted_indices = []
  var wait_flag = false
  for (var i = response.blocks.length - 1; i >= 0; i--) {
    var line_arr = response.blocks.at(i)?.lines
    if (line_arr != undefined) {
      for (var j = line_arr.length - 1; j >= 0; j--) {
        if (isPrice(line_arr[j].text)) {
          if (num_prices >= 0) {
            prices.push(parseFloat(line_arr[j].text) - to_deduct)
            to_deduct = 0
          }
          num_prices++;
        } else if (isDiscount(line_arr[j].text)) {
          to_deduct = parseFloat(line_arr[j].text.replace(/!$/, "")) // takes the price to deduct and removes the ending - and casts to float
          deducted_indices.push(num_prices)
        } else if (isTotal(line_arr[j].text)) {
          item_dict["TOTAL"] = prices[total_ind];
          total_ind++;
          total_hit = true;
        } else if (total_ind < num_prices && total_hit) {
          if (wait_flag) {
            item_dict[strClean(line_arr[j].text)] = prices[total_ind];
            wait_flag = false
            total_ind++;
          } else if (deducted_indices.indexOf(total_ind) === -1) { // if the total_ind index is not in the list of deducted_indices 
            item_dict[strClean(line_arr[j].text)] = prices[total_ind];
            total_ind++;
          } else { // wait flag is set if it wasn't previously set and the total_ind was in the deducted_indices
            wait_flag = true
          }
        }
      }
    }
  }
  return item_dict
};

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
          console.log(getStore(response))
          // console.log(isPrice("4.43"))
          console.log(parseOutput(response))
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