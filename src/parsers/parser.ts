import { ITextRecognitionResponse } from "../components/mlkit";
import { parseGeneric } from "./genericParser";
import { IParser, IParserResult } from "./IParser";
import safewayParser from './safewayParser';
import traderJoeParser from "./traderJoeParser";
import mcDonaldsParser from "./mcDonaldsParser";
import parseTools from "./parserTools";
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useEffect, useState } from 'react';

function getStore(response: ITextRecognitionResponse): string | undefined {
  // Takes response and returns the first 3 lines without whitespace or periods in lowercase for matching
  var lines_out = []

  for (var i = 0; i < response.blocks.length; i++) {
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
  const re_traderjoe = new RegExp(".*trader joe.*|.*traderjoe.*", "g");
  const re_mcdonalds = new RegExp(".*mcdonald.*|.*mcdon.*|.*donald's.*|.*mcdonal.*")
  const re_stores = [re_costco, re_safeway, re_traderjoe, re_mcdonalds]
  const stores = ["costco", "safeway", "trader joe", "mcdonalds"]

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

async function parseOutput(response: ITextRecognitionResponse, uri: string): Promise<IParserResult | undefined> {
  var store_name = getStore(response)
  if (store_name == "costco") {
    return parseCostco(response)
  }
  if (store_name == "safeway") {
    return parseSafeway(response);
  }
  if (store_name === "trader joe") {
    return parseTraderJoe(response);
  }
  if (store_name == "mcdonalds") {
    return parseMcDonalds(response);
  }
  let genericDict: { [key: string]: number } =  await parseGeneric(uri);
  return genericDict;
};

function parseSafeway(response: ITextRecognitionResponse): IParserResult {
  return safewayParser.pairItemtoPriceSafeway(response);
};

function parseTraderJoe(response: ITextRecognitionResponse): IParserResult {
  return traderJoeParser.pairItemtoPriceTraderJoe(response);
};

function parseMcDonalds(response: ITextRecognitionResponse): IParserResult {
  return mcDonaldsParser.pairItemtoPriceMcDonalds(response);
};

function pricesChecksum(prices: number[]): boolean {
  // takes a dict produced from parseOutput and checks to make sure the values add up to the total
  let max = 0
  let sum = 0
  for (var i in prices) {
      // console.log(price)
      if (prices[i] > max) {
          max = prices[i]
      }
      sum += prices[i];
      sum = parseTools.roundPrice(sum)
  }
  sum = parseTools.roundPrice(sum)
  let check = sum % max;
  if (check == 0) {
      return true
  }
  return false
}



function parseCostco(response: ITextRecognitionResponse): { [key: string]: number } {
  let items = parseTools.genList(response)
  let prices = parseTools.grabPrices(items)
  let priceCheck = pricesChecksum(prices)
  if (!priceCheck) {
    prices = parseTools.secondaryPrices(items)
  }
  
  let num_items = prices.length
  let item_count = 0
  let total_hit = false
  const item_dict: { [key: string]: number } = {};
  // console.log(items)
  // console.log(prices)
  for (var i = items.length - 1; i >= 0; i--) {
    let current = items[i]
    if (total_hit && item_count < num_items && !parseTools.isSubtotal(current) 
        && !parseTools.isStringDiscount(current) && !parseTools.isPrice(current) 
        && !parseTools.isDiscount(current) && !parseTools.isChar(current) && !parseTools.isNonsense(current)) {
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
  console.log(item_dict)
  return item_dict
};

const parser: IParser = {
  parseOutput
}

export default parser;

export function checksum(item_dict: { [key: string]: number; }) {
  throw new Error("Function not implemented.");
}
