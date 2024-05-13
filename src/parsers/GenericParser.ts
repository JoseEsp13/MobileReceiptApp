import { ITextRecognitionResponse } from "../components/mlkit";
import MLkit from "../components/mlkit/index.ts"
import { IParser } from "./IParser";
import { ToastAndroid, Alert, Button } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

export async function parseGeneric(setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>) {
  const {distance, closest} = require('fastest-levenshtein');
  let item_dict: {[key: string]: number} = {};

  // Puts a little message for user
  ToastAndroid.showWithGravity(
    "Please crop the image",
    ToastAndroid.LONG,
    ToastAndroid.TOP
  );

  // Function which checks how similar two strings are
  const similar = (str1: string, str2: string, threshold = 0.6) => {
    let dist: number = distance(str1, str2);
    let max_len: number = Math.max(str1.length, str2.length);
    let similarity: number = 1 - distance / max_len;
    return similarity >= threshold;
  }

  const postProcess = (response: ITextRecognitionResponse): string[] | undefined => {
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

    for (let i = response.blocks.length - 1; i >= 0; i--) {
      for (let j = response.blocks[i].lines.length - 1; j >= 0; j--) {
        let item = response.blocks[i].lines[j];
        let text = response.blocks[i].lines[j].text;
        let ycord = item.rect.top;
        let xcord = item.rect.left;
        let width = item.rect.width;
        console.log(text, xcord, ycord, width);
      }
    }
    let i = 0;
    for (i; i < related.length; i++) {
      dict[related[i]] = item_prices[i];
    }

    for (let j = 0; j < item_names.length; j++) {
      dict[item_names[j]] = item_prices[i];
      i++;
    }

    console.log("price\t", item_prices);
    console.log("name\t", item_names);
    console.log("misc\t", misc);
    console.log("relate\t", related);
    console.log("quant\t", quantity);

    for (let key in dict){
      console.log(key, "\t", dict[key]);
    }

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
