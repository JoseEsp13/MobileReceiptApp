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

/**
 * ML Kit response parser for Safeway Receipts.
 * Uses x and y coordinates from items and prices found
 * in the response to slap together a dictionary.
 * FlowChart:
 *  1. split response lines to items and prices.
 *     Also cleaned up item names and skipped anything
 *     related to savings.
 *  2. for every price, find its closest item that is
 *     not located near according to its x axis
 *  3. fill a backwards dictionary of prices with their
 *     closest items
 *  4. flip the dictionary. Items with multiple prices
 *     (original and discounted), chooses the discounted
 *     price.
 * 
 * Notes for Safeway Receipts:
 *  - "Total" is read by the OCR from "Total Savings",
 *    for membership accounts. So it might be better to
 *    use "Balance" or "Payment Amount" for the final price.
 *    Currently anything with the same price as "Balance" is
 *    removed from the dictionary (line 101-106).
 *  - Anything related to Savings was skipped(line 61-66).
 * 
 * Context for Variebles:
 *  prices: [price, ycoor, xcoor, width][]
 *  items:  [item name, ycoor, xcoor][]
 *  regex:  matches string to a price format
 *  regex2: used to check if ',' was read for a price. edge case
 * @param response 
 * @returns {[key: string]: number}
 */
function pairItemtoPriceSafeway(response: ITextRecognitionResponse): {[key: string]: number} {
  let dict: {[key: number]: string[]} = {};
  const prices: [number, number, number, number][] = [];    
  const items: [string, number, number][] = [];  
  const regex = /-?\d+\.\d{1,2}|-?\d+\,\d{1,2}/g;
  const regex2 = /-?\d+\,\d{1,2}/g;
  let match;
  for (let i = 0; i < response.blocks.length; i++) {
    for (let j = 0; j < response.blocks[i].lines.length; j++) {
      let checkifNotPrice: boolean = true;
      let item = response.blocks[i].lines[j];
      const skipSavings = 
        ["saving", "total", "member", "mermber", "nenber"];
      if (skipSavings.some(skip =>
          item.text.toLowerCase().includes(skip))) {
        continue;
      }
      while ((match = regex.exec(item.text)) !== null) {
        let str: string = match[0];
        if (regex2.test(str)) {
          str = str.replace(/,/g, '.');
        }
        prices.push(
            [Number(str), item.rect.top, item.rect.left, item.rect.width]);
        checkifNotPrice = false;
      }
      if (checkifNotPrice && !(/^\d+$/.test(item.text))) {
        items.push([item.text.replace(/^\d*[\s*%]*|^\W+/, ''),
          item.rect.top, item.rect.left]);
      }
    }
  }

  for (let a = 0; a < prices.length; a++) {
    let minitem = items[0];
    for (let b = 0; b < items.length; b++) {
      if (Math.abs(items[b][2] - prices[a][2]) > prices[a][3]) {
        let newval = Math.abs(prices[a][1] - items[b][1]);
        if (newval < Math.abs(prices[a][1] - minitem[1])) {
          minitem = items[b];
        }
      }
    }

    if (prices[a][0] in dict) {
      dict[prices[a][0]].push(minitem[0]);
    } else {
      dict[prices[a][0]] = [minitem[0]];
    }
  }

  for (let key in dict) {
    if (dict[key].includes("BALANCE")) {
      const arr = ["BALANCE"];
      dict[key] = arr;
    }
  }

  const flipped: {[key: string]: number} = {};
  for (const k in dict) {
    dict[k].forEach((v) => {
      if (v in flipped) {
        flipped[v] = Math.min(Number(k), flipped[v]);
      } else {
        flipped[v] = Number(k);
      }
    });
  }
  return flipped;
};

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

/**
 * Receipt images tested for Safeway both had a Ctrl
 * key pretruding in the frame, messing with getStore().
 * Right now parseSafeway() executes if receipt
 * was not determined to be Costco.
 * @param response 
 * @returns Object
 */
function parseOutput(response: ITextRecognitionResponse): Object {
  var store_name = getStore(response)
  if (store_name == "costco") {
    return parseCostco(response)
  }
  return parseSafeway(response);
  if (store_name == "safeway") {
    return parseSafeway(response);
  }
  return Object;
};

function parseSafeway(response: ITextRecognitionResponse): Object {
  return pairItemtoPriceSafeway(response);
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