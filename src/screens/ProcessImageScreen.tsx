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

interface StringKeyNumberValueObject {
  [key: string]: number;
}

interface NumberKeyStringArrayObject {
  [key: number]: string[];
}

function removeKey<T extends StringKeyNumberValueObject | NumberKeyStringArrayObject>(dict: T, key: keyof T): Omit<T, keyof T> {
  const { [key]: removedKey, ...newDict } = dict;
  return newDict;
}

/**
 * Print Dictionary function
 * normally meant for {[key: string]: number}
 * otherwise will try to do {[key: number]: string[]}
 * @param dict {[key: string]: number} | {[key: number]: string[]}
 */
function printDictionary(
  dict: StringKeyNumberValueObject | 
        NumberKeyStringArrayObject) {
  if ("BALANCE" in dict || "TOTAL" in dict) {
    console.log("dictionary:");
    for (const key in dict) {
      console.log(`Key: ${key}, Value: ${dict[key]}`);
    }
  } else {
    console.log("number dictionary:");
    for (const key in dict) {
      console.log(`Key: ${key}, Values: ${dict[key].join(', ')}`);
    }
  }
}

/**
 * checks if inputed string is a price
 * returns the parsed string of the price
 * if not "no match"
 * Context for Variables:
 *  re_price: used to find price in
 *            "PRICE+anything_else"
 *  re_price2: used to find price in
 *            "not_discount_price+PRICE+anything_else"
 * @param price 
 * @returns string
 */
function isPriceSafeway(price: string): string {
  const re_price = /^(\d+\.\d{2}).*$/;
  const re_price2 = /^(\d+\.\d{2}) *[$]* *(\d+\.\d{2}).*$/;
  let match = price.match(re_price2);
  if (match) {
    console.log("\"" + price + "\"" + " match2:" + match[2]);
    return match[2];
  }
  match = price.match(re_price);
  if (match) {
    console.log("\"" + price + "\"" + " match:" + match[1]);
    return match[1];
  }
  console.log("\"" + price + "\"" + " no match");
  return "no match";
};

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
 *  - Anything related to Savings was skipped(line 96-100).
 *  - Balance is the total. 
 *  - Skip unnecessary items(line 149-154)
 * 
 * Context for Variebles:
 *  prices: [price, ycoor, xcoor, width][]
 *  items:  [item name, ycoor, xcoor][]
 *  widthScale: arbitrary scale value to prevent prices to match: xdist from price to item > widthScale*width
 *  regex2: used to check if ',' was read for a price. edge case
 *  regex3: remove any unnecessary items acquired from receipt
 *  regex4: used to remove any unnecessary items: may need to be implemented further
 * 
 * THINGS TO WORK ON:
 *  - misses "BLCK BN TIN 15.52", reads it as price when it should be an item
 * @param response 
 * @returns {[key: string]: number}
 */
function pairItemtoPriceSafeway(response: ITextRecognitionResponse): {[key: string]: number} {
  let dict: {[key: number]: string[]} = {};
  const prices: [number, number, number, number][] = [];    
  const items: [string, number, number][] = [];
  const regex2 = /-?\d+\,\d{1,2}/g;
  let match;
  for (let i = 0; i < response.blocks.length; i++) {
    for (let j = 0; j < response.blocks[i].lines.length; j++) {
      let checkifNotPrice: boolean = true;
      let item = response.blocks[i].lines[j];
      const regex3 = 
        /.*saving.*|.*total.*|.*member.*|.*mermber.*|.*nenber.*/i;
      if (regex3.test(item.text)) {
        continue;
      }
      let str: string;
      if ((str = isPriceSafeway(item.text)) != "no match") {
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

  let widthScale: number = 2.5;
  for (let a = 0; a < prices.length; a++) {
    if (prices[a][0] <= 0) {
      continue;
    }
    let minitem = items[0];
    for (let b = 0; b < items.length; b++) {
      if (Math.abs(items[b][2] - prices[a][2]) > widthScale*prices[a][3]) {
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

  let flipped: {[key: string]: number} = {};
  for (const k in dict) {
    dict[k].forEach((v) => {
      if (v in flipped) {
        flipped[v] = Math.min(Number(k), flipped[v]);
      } else {
        flipped[v] = Number(k);
      }
    });
  }
  
  const regex4 = /.*change.*|.*points.*|.*price.*|.*pay.*|.+balance.*|.*snap.*|.*snp.*|.*master.*|.*debt.*|.*grocery.*|.*your.*|.*:.*/i;
  for (const ke in flipped) {
    if (regex4.test(ke)) {
      flipped = removeKey(flipped, ke);
    }
  }

  return flipped;
};

function getStore(response: ITextRecognitionResponse): string | undefined {
  // Takes response and returns the first 3 lines without whitespace or periods in lowercase for matching
  var lines_out = []

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < response.blocks[i].lines.length; j++) {
      var store = response.blocks.at(i)?.lines[j]
      if (store != undefined) {
        var store_text = store.text.replace(/\s/g, "").toLowerCase();
        store_text = store_text?.replace(/\./g, "")
        lines_out.push(store_text)
      } 
    }
  }
  return matchStore(lines_out)
};

function matchStore(stores_in: string[]): string | undefined {
  // Takes a string store (obtained from getStore) and returns the matched store
  if (stores_in == undefined) {
    return undefined
  }
  const re_costco = new RegExp(".*costco.*|.*cost.*|.*cos.*|.*ostc.*|.*stco.*", "g")
  const re_safeway = new RegExp(".*safeway.*|.*safe.*|.*fewa.*", "g")
  const re_stores = [re_costco, re_safeway]
  const stores = ["costco", "safeway"]
  
  for (var i in stores_in) {
    var store = stores_in[i]

    if (store == undefined) {
      continue
    }

    for (var r in re_stores) {
      if (store.match(re_stores[r])) {
        return stores[r]
      }
    }
  }
  return undefined
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

function parseOutput(response: ITextRecognitionResponse): {[key: string]: number} | undefined {
  var store_name = getStore(response)
  if (store_name == "costco") {
    return parseCostco(response)
  }
  if (store_name == "safeway") {
    return parseSafeway(response);
  }
  return undefined;
};

function parseSafeway(response: ITextRecognitionResponse): {[key: string]: number} {
  return pairItemtoPriceSafeway(response);
};

function parseCostco(response: ITextRecognitionResponse): {[key: string]: number} {
  const item_dict: {[key: string]: Float} = {};
  var num_prices = -2
  var prices = []
  var total_ind = 0
  var total_hit = false
  var to_deduct = 0
  var deducted_indices = []
  var wait_flag = false
  var price_height = []

  for (var i = response.blocks.length - 1; i >= 0; i--) {
    var line_arr = response.blocks[i].lines
    
    if (line_arr != undefined) {

      for (var j = line_arr.length - 1; j >= 0; j--) {
        var block_h = response.blocks[i].lines[j].rect.height
        if (isPrice(line_arr[j].text)) {
          if (num_prices >= 0) {
            prices.push(parseFloat(line_arr[j].text) - to_deduct)
            to_deduct = 0
            
            if (block_h !== undefined) {
              price_height.push(block_h)
            }
            
          }
          num_prices++;

        } else if (isDiscount(line_arr[j].text)) {
          to_deduct = parseFloat(line_arr[j].text.replace(/!$/, "")) // takes the price to deduct and removes the ending - and casts to float
          deducted_indices.push(num_prices)

        } else if (isTotal(line_arr[j].text)) {
          item_dict["TOTAL"] = prices[total_ind];
          total_ind++;
          total_hit = true;
          console.log(price_height)

        } else if (total_ind < num_prices && total_hit && Math.min.apply(Math, price_height) - 20 <= block_h && block_h <= Math.max.apply(Math, price_height) + 20) {
          if (wait_flag) {
            item_dict[strClean(line_arr[j].text)] = prices[total_ind];
            wait_flag = false;
            total_ind++;

          } else if (deducted_indices.indexOf(total_ind) === -1) { // if the total_ind index is not in the list of deducted_indices 
            item_dict[strClean(line_arr[j].text)] = prices[total_ind];
            total_ind++;

          } else { // wait flag is set if it wasn't previously set and the total_ind was in the deducted_indices
            wait_flag = true
          }
        }
        // console.log(line_arr[j].text)
        // console.log(block_h)
      }
    }
  }
  return item_dict
};

function roundPrice(price: Float): Float {
  return Math.floor(price * 100) / 100;
}

function checksum(dict: {[key: string]: number}): boolean {
  // takes a dict produced from parseOutput and checks to make sure the values add up to the total
  let prices = []
  let max = 0
  let sum = 0
  for (let key in dict) {
    var price = dict[key]
    // console.log(price)
    prices.push(price);
    if (price > max) {
      max = price
    }
    sum += price;
  }
  sum = roundPrice(sum)
  console.log(sum)
  console.log(max)
  let check = Math.trunc(sum/max);
  if (check == 3) {
    return true
  }
  if (check == 2) {
    return true
  }
  if (check == 1) {
    return true
  }
  return false
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
          // console.log(getStore(response))
          // console.log(isPrice("4.43"))
          let dict = parseOutput(response)
          console.log(dict)
          if (dict != undefined) {
            console.log(checksum(dict))
          }
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