import MLKit, {ITextRecognitionResponse} from "../components/mlkit";
import { IParser, IParserResult } from "./IParser";
import { ToastAndroid, Alert, Button } from 'react-native';
import { ColorSpace } from "react-native-reanimated";
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useEffect, useState } from 'react';
import routes from '../routes';
import { completeHandlerIOS } from "react-native-fs";

export async function parseGeneric(setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>): Promise<IParserResult> {

  let item_dict:  {[key: string]: number} = {};

  // Puts a little message for user
  ToastAndroid.showWithGravity(
    "Please crop the image", 
    ToastAndroid.SHORT,
    ToastAndroid.TOP
  );

  const postProcess = (response: ITextRecognitionResponse): string[] | undefined => {
    console.log("In function");
    let misc: string[] = [];
    let related: string[] = [];
    let item_names: string[] = [];
    let item_prices: string[] = [];
    let item_id: string[] = [];
    let quantity: string[] = [];
    const IsPriceRegex = /^\$?\d+\.\d+$/;
    const ItemId = /^\d{2,}$/;
    const Quantity = /^\d$/;
    const RelatedButNotItem = /total|tax|amt|balance|subtotal/
    for (let i = response.blocks.length - 1; i >= 0; i--) {
      for (let j = response.blocks[i].lines.length - 1; j >= 0; j--) {
        let item = response.blocks[i].lines[j].text;                   // This will give you an individual item
        item = item.toLowerCase();                                     // Lowercasing
        item = item.replace(/\s{2,}/g," ");                            // Remove White Spaces
        // Gets things which are of format $?0.0
        if (IsPriceRegex.test(item)) {
          // console.log("The string matches the a price.\t", item);
          item_prices.push(item);
        }
        // Gets words like total
        else if (RelatedButNotItem.test(item)) {
          related.push(item);
        }
        // Gets item_ids which are numbers of \d{2,} like 12 or 283812
        else if (ItemId.test(item)) {
          misc.push(item);
        }
        else if (Quantity.test(item)){
          quantity.push(item);
        }
        else {
          item_names.push(item);
        }
      }
    }
    console.log("price\t",item_prices);
    console.log("name\t", item_names);
    console.log("misc\t", misc);
    console.log("relate\t", related);
    console.log("quant\t",quantity);
    
    return item_names;
  };


  const { scannedImages } = await DocumentScanner.scanDocument();
  
  if (scannedImages && scannedImages.length > 0) {
    const response = await MLKit.recognizeImage(scannedImages[0]);
    console.log(scannedImages[0])
    setResponse(response);
    console.log("before post");
    // console.log(response)
    postProcess(response);
    console.log("after_post");
  }
  
  return item_dict as IParserResult;
}
