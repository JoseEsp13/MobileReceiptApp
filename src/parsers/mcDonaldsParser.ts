import { ITextRecognitionResponse } from "../components/mlkit";
import parseTools from "./parserTools";
import { IMcDonalds } from "./IParser";

function isTransTotal(name: string): boolean {
  const re_transtotal = /TRANSACTION AMOUNT|.*TRANSACTION.*|.*ANSACTION AMO.*|.*SACTION.*/;
  return re_transtotal.test(name)
}

function eatTotal(name: string): boolean {
  const re_transtotal = /Eat-In Total|.*In Total.*|.*Eat-In.*|.*Take-Out Total.*|....*-...* Total|.*Out Tot.*/;
  return re_transtotal.test(name)
}

function isSubtotal(name: string): boolean {
  const re_subtotal = /Subtotal|S.*total|.*ubtotal.*|.*ubtot.*|.*Sub.*tal/;
  return re_subtotal.test(name)
}

function isCharOrTwoChar(name: string): boolean {
  const re_chars = /^.$|^..$/;
  return re_chars.test(name)
}

function isBogo(name: string): boolean {
  const re_bogo = /.*BOGO.*/;
  return re_bogo.test(name)
}

function fixCommaPrice(name: string): string {
  const re_commaprice = /,/gi;
  let out = name.replace(re_commaprice, '.');
  return out.trim();
}

function grabMcPrices(items: string[]): number[] {
  // Iterate through output bottom to top to grab all prices, return array of Floats in order from bottom to top. Also deducts discounts from apropriate items.

  let prices = []
  let skip = 0
  for (var j = items.length - 1; j >= 0; j--) {
    var item = fixCommaPrice(items[j])
    if (parseTools.isPrice(item)) {
      if (skip > 0) {
        skip--;
        continue
      } else if (isTransTotal(items[j+1]) || isTransTotal(items[j-1])) {
        skip = 4
      }
      prices.push(parseFloat(item))
    }
  }

  prices.splice(2, 1);
  return prices
};

export function pairItemtoPriceMcDonalds(response: ITextRecognitionResponse): {[key: string]: number} {
  let items = parseTools.genList(response)
  let prices = grabMcPrices(items)
  let num_items = prices.length
  let item_count = 0
  let total_hit = false
  const item_dict: {[key: string]: number} = {};
  console.log(items)
  console.log(prices)
  for (var i = items.length - 1; i >= 0; i--) {
    let current = items[i]
    if (total_hit && item_count < num_items && !isBogo(current) && !isSubtotal(current) 
      && !parseTools.isPrice(fixCommaPrice(current)) && !isCharOrTwoChar(current)) {
      let clean_item = parseTools.strClean(current)
      if (clean_item in item_dict) {
        item_dict[clean_item + String(item_count)] = prices[item_count]
        item_count++;
      } else {
        // console.log("APPENDING NEW ITEM=" + String(current))
        item_dict[clean_item] = prices[item_count]
        item_count++;
      }
    } else if (eatTotal(current)) {
      // console.log("TOTAL HIT=" + String(current))
      item_dict["TOTAL"] = prices[item_count]
      item_count++;
      total_hit = true
    }
  }
  console.log(item_dict)
  return item_dict
};

const mcDonaldsParser: IMcDonalds = {
    pairItemtoPriceMcDonalds
}

export default mcDonaldsParser;