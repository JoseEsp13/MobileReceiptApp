import { ITextRecognitionResponse } from "../components/mlkit/index.ts";
import MLkit from "../components/mlkit/index.ts"
import { IParser } from "./IParser.ts";
import { ToastAndroid, Alert, Button } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import * as parseFunctions from "./parser.ts";
import ImagePicker from 'react-native-image-crop-picker';

interface Item {
    text: string;
    xcord: number;
    ycord: number;
    width: number;
}

let inUrl = "";
/* parseGeneric(setResponse)
 * A function which will parse very simple inputs
 * Goal: To extract the items from basic line to price receipts
 * Wanted: [{Item: Price}, Sub-Total, Sales Tax, Total]
 * List of Random Receipts:
 *  Student Health Center x
 *  Target 
 *  Walmart
 *  CVS-Pharmacy
 *  Sephora
 *  Marshalls
 */

export async function parseGeneric(url: string): Promise<{[key: string]: number}> {
  const {distance, closest} = require('fastest-levenshtein');
  let item_dict: {[key: string]: number} = {};
  let inUrl = url;
  // Puts a little message for user
  ToastAndroid.showWithGravity(
    "Please crop the image starting from the first item to the total",
    ToastAndroid.LONG,
    ToastAndroid.TOP
  );

  function convertToNumber(input: string): number {
    let number = Number(input.replace(/[^0-9\.\-]/g, ''));
    return number;
  }
  /* pairItems()
  * Returns an [Item, Item] array where and Item contains an item and the xcord
  */
  function pairItems(items: Item[]): Array<[Item, Item]> {
    // Sort items by y-coordinate
    items.sort((a, b) => a.ycord - b.ycord);

    // Calculate the mean
    let mean = items.reduce((sum, item) => sum + item.ycord, 0) / items.length;

    // Calculate the standard deviation
    let stdDev = Math.sqrt(items.reduce((sum, item) => sum + Math.pow(item.ycord - mean, 2), 0) / items.length);

    let pairs: Array<[Item, Item]> = [];
    let usedItems: Set<Item> = new Set();

    for (let i = 0; i < items.length - 1; i++) {
        // Skip items that have already been paired
        if (usedItems.has(items[i])) continue;

        // Calculate the difference between the current item and the next one
        let diff = items[i + 1].ycord - items[i].ycord;

        // If the difference is less than or equal to the standard deviation, pair the items
        if (diff <= stdDev) {
            pairs.push([items[i], items[i + 1]]);
            usedItems.add(items[i]);
            usedItems.add(items[i + 1]);
        }
    }
    return pairs;
  }
  // Function which checks how similar two strings are
  const similar = (str1: string, str2: string, threshold = 0.6) => {
    let dist: number = distance(str1, str2);
    let max_len: number = Math.max(str1.length, str2.length);
    let similarity: number = 1 - distance / max_len;
    return similarity >= threshold;
  }

  const postProcess = (response: ITextRecognitionResponse): { [key: string]: number } | undefined => {
    let items: Item[] = [];
    let dict: { [key: string]: string } = {};
    const Price = /^-?\$?\d+(\.\d+)?\s?[A-Z]{0,2}$/
    const ItemNumber = /^\d{4,}$/;
    const RandomLetter = /^[a-zA-Z]$/;
    const IgnoreWords = /SUBTOTAL|VISA|ITEM|LB|SAVE|@|^MEAT$|GROCERY/;
    const DuplicateItems = /^\d+\s?.\s?[\$S]?\d+\.\d{0,2}$/;
    const SynonymTotal = /TOTAL|BALANCE|PAY/;
    for (let i = response.blocks.length - 1; i >= 0; i--) {
      for (let j = response.blocks[i].lines.length - 1; j >= 0; j--) {
        let item = response.blocks[i].lines[j];
        let text = response.blocks[i].lines[j].text.toUpperCase();
        let ycord = item.rect.top;
        let xcord = item.rect.left;
        let width = item.rect.width;
        
        text = text.replace(SynonymTotal, 'TOTAL');
        console.log(`${text.padEnd(30)} ${xcord.toString().padStart(10)} ${ycord.toString().padStart(10)} ${width.toString().padStart(10)}`);  // This line tells me everyhing I need
        if (!ItemNumber.test(text) && !RandomLetter.test(text) && !DuplicateItems.test(text)) { 
          items.push({ text, ycord: ycord, xcord: xcord, width: width });
        }
      }
    }
    
    // Sort Items by xcord
    items.sort((a, b) => a.xcord - b.xcord);
    
    let pairs = pairItems(items);
    // for (let pair of pairs) {
    //   console.log(`Pair: [${pair[0].text}, ${pair[1].text}]`);
    // }

    // Assigns the dictionary values, if the first value of pair[i], i.e [Item, Item] where pair[0] is a price, it swaps basically.
    for (let pair of pairs) {
      // console.log(`pair[0].text ${pair[0].text.padEnd(30)} pair[0].xcord ${pair[0].xcord} pair[0].text ${pair[1].text.padEnd(30)} pair[0].xcord ${pair[1].xcord}`)
      if (Price.test(pair[0].text)) {
        dict[pair[1].text] = pair[0].text;
      }
      else {
        dict[pair[0].text] = pair[1].text;
      }
    }

    // This will loop and convert any "," which look like periods in prices into a "."
    for (let key in dict) {
      if (dict[key].includes(',')) {
        dict[key] = dict[key].replace(',', '.');
      }
      if (!IgnoreWords.test(key)){
        item_dict[key] = convertToNumber(dict[key]);
      }
      else {
        // console.log(`Ignoring ${key}`)
        delete dict[key];
      }
    }
    // To print out the dictionary
    // console.log("Dictionary");
    // for (let key in item_dict) {
    //   console.log(`${key.padEnd(30)}:${item_dict[key]}`);
    // }

    return item_dict;
  };
  const image = await ImagePicker.openCropper({
    path: inUrl,
    includeBase64: true,
    mediaType: "photo",
    cropping: true,
    freeStyleCropEnabled: true,
    enableRotationGesture: false,
  });

  if (image) {
    const response: ITextRecognitionResponse = await MLkit.recognizeImage(image.path);
    item_dict = postProcess(response) || {};
  }
  return item_dict;
}
