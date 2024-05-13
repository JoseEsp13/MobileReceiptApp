import { ITextRecognitionResponse } from "../components/mlkit";
import MLkit from "../components/mlkit/index.ts"
import { IParser } from "./IParser";
import { ToastAndroid, Alert, Button } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

interface Item {
    text: string;
    xcord: number;
}

/* parseGeneric(setResponse)
 * A function which will parse very simple inputs
 * Goal: To extract the items from basic line to price receipts
 * Wanted: [{Item: Price}, Sub-Total, Sales Tax, Total]
 * List of Random Receipts:
 *  Student Health Center
 *  Target
 *  Walmart
 *  CVS-Pharmacy
 *  Sephora
 *  Marshalls
 */

/* Steps to complete this
 * Console log everything
 * 
 */
export async function parseGeneric(setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>) {
  const {distance, closest} = require('fastest-levenshtein');
  let item_dict: {[key: string]: number} = {};

  // Puts a little message for user
  ToastAndroid.showWithGravity(
    "Please crop the image",
    ToastAndroid.LONG,
    ToastAndroid.TOP
  );

  function pairItems(items: Item[]): Array<[Item, Item]> {
    // Sort items by number
    items.sort((a, b) => a.xcord - b.xcord);

    // Calculate the mean
    let mean = items.reduce((sum, item) => sum + item.xcord, 0) / items.length;

    // Calculate the standard deviation
    let stdDev = Math.sqrt(items.reduce((sum, item) => sum + Math.pow(item.xcord - mean, 2), 0) / items.length);

    let pairs: Array<[Item, Item]> = [];
    let usedItems: Set<Item> = new Set();

    for (let i = 0; i < items.length - 1; i++) {
        // Skip items that have already been paired
        if (usedItems.has(items[i])) continue;

        // Calculate the difference between the current number and the next one
        let diff = items[i + 1].xcord - items[i].xcord;

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

  const postProcess = (response: ITextRecognitionResponse): string[] | undefined => {
    let items: Item[] = [];
    let misc: string[] = [];
    let related: string[] = [];
    let item_names: string[] = [];
    let item_prices: string[] = [];
    let quantity: string[] = [];
    let saving: string[] = [];
    let dict: { [key: string]: string } = {};

    const IsSavings = /member|saving/;
    const IsPriceRegex = /^\$?\d+\.\d+\s?[a-zA-Z]?$/;
    const ItemId = /^\d{2,}$/;
    const Quantity = /^\d|\d+.d+ x \d+$/;
    const RelatedButNotItem = /total|tax|amt|balance|subtotal/;
    const Price = /\d+(\.\d+)?\s?[a-zA-Z]?/
    let adict: { [key: string]: number } = {}; // Fix: Specify key as string and value as any
    for (let i = response.blocks.length - 1; i >= 0; i--) {
      for (let j = response.blocks[i].lines.length - 1; j >= 0; j--) {
        let item = response.blocks[i].lines[j];
        let text = response.blocks[i].lines[j].text;
        let ycord = item.rect.top;
        let xcord = item.rect.left;
        let width = item.rect.width;
        // console.log(`${text.padEnd(30)} ${xcord.toString().padStart(10)} ${ycord.toString().padStart(10)} ${width.toString().padStart(10)}`);
        // adict[text] = ycord;
        items.push({ text, xcord: ycord });
      }
    }

    let pairs = pairItems(items);
    for (let pair of pairs) {
      if (Price.test(pair[0].text)) {
        // console.log("match");
      }
      console.log(`${pair[0].text.padEnd(30)} ${pair[0].xcord.toString().padStart(10)} : ${pair[1].text.padEnd(30)} ${pair[1].xcord.toString().padStart(10)}`);
}
      // console.log(`pairs[0]: ${pair[0]} pairs[1]: ${pair[1]} pairs: ${pair}`);
      

    // const sortedKeys = Object.keys(adict).sort((a, b) => adict[a] - adict[b]);
    // for (const key of sortedKeys) {
    //   const text = key;
    //   const ycord = adict[key];
    //   console.log(`${text.padEnd(30)} ${ycord.toString().padStart(10)}`);
    // }

    // console.log("price\t", item_prices);
    // console.log("name\t", item_names);
    // console.log("misc\t", misc);
    // console.log("relate\t", related);
    // console.log("quant\t", quantity);

    // for (let key in dict){
    //   console.log(key, "\t", dict[key]);
    // }

    return item_names;
  };

  const { scannedImages } = await DocumentScanner.scanDocument();

  if (scannedImages && scannedImages.length > 0) {
    const response = await MLkit.recognizeImage(scannedImages[0]); // Fix: Use recognizeImage from MLkit
    console.log(scannedImages[0]);
    setResponse(response);
    postProcess(response);
  }

  return item_dict;
}
