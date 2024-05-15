import { ITextRecognitionResponse } from "../components/mlkit";
import parseTools from "./parser";
import { IMcDonalds } from "./IParser";

export function pairItemtoPriceMcDonalds(response: ITextRecognitionResponse): {[key: string]: number} {
    let items = parseTools.genList(response)
    let prices = parseTools.grabPrices(items)
    let num_items = prices.length
    let item_count = 0
    let total_hit = false
    const item_dict: {[key: string]: number} = {};
    console.log(items)
    console.log(prices)
    for (var i = items.length - 1; i >= 0; i--) {
      let current = items[i]
      if (total_hit && item_count < num_items && !parseTools.isSubtotal(current) 
        && !parseTools.isStringDiscount(current) && !parseTools.isPrice(current) 
        && !parseTools.isDiscount(current) && !parseTools.isChar(current)) {
        let clean_item = parseTools.strClean(current)
        if (clean_item in item_dict) {
          item_dict[clean_item + String(item_count)] = prices[item_count]
          item_count++;
        } else {
          // console.log("APPENDING NEW ITEM=" + String(current))
          item_dict[clean_item] = prices[item_count]
          item_count++;
        }
      }
      else if (parseTools.isTotal(current)) {
        // console.log("TOTAL HIT=" + String(current))
        item_dict["TOTAL"] = prices[item_count]
        item_count++;
        total_hit = true
      }
    }
    return item_dict
  };

const mcDonaldsParser: IMcDonalds = {
    pairItemtoPriceMcDonalds
}

export default mcDonaldsParser;