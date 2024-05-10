import { ITextRecognitionResponse } from "../components/mlkit";
import { parseGeneric } from "./GenericParser";
import { IParser } from "./IParser";
import safewayParser from './safewayParser';
import traderJoeParser from "./traderJoeParser";
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
  const re_stores = [re_costco, re_safeway, re_traderjoe]
  const stores = ["costco", "safeway", "trader joe"]
  
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
  const re_price = /^\d+\.\d{2}$|^\d+\.\d{2} .$/;
  return re_price.test(price);
};

function isDiscount(price: string): boolean {
  // checks if a string matchs a price with a minus sign at the end to indicate discount
  const re_discount = /^\d+\.\d{2}-$/;
  return re_discount.test(price);
}

function isTotal(str: string): boolean {
  // checks if a string matches **** Total
  const re_total = /^\*+ TOTAL$|^\*\*+/;
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
};

function isStringDiscount(name: string): boolean {
  // checks if a string matches the name of a costco discount, generally of form "032456 /52345243" or similar
  const re_discount = /\d+ \/\d+|\d+ \/ \d+/;
  return re_discount.test(name)
}

function isSubtotal(name: string): boolean {
  const re_subtotal = /SUBTOTAL|S.*TOTAL|.*UBTOTAL.*|UBTOT/;
  return re_subtotal.test(name)
}

function parseOutput(response: ITextRecognitionResponse, setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>): {[key: string]: number} | undefined {
  var store_name = getStore(response)
  if (store_name === "costco") {
    return parseCostco(response);
  } else if (store_name === "safeway") {
    return parseSafeway(response);
  } else if (store_name === "trader joe") {
    return parseTraderJoe(response);
  } else {
    parseGeneric(setResponse);
  }
  return undefined;
};

function parseSafeway(response: ITextRecognitionResponse): {[key: string]: number} {
  return safewayParser.pairItemtoPriceSafeway(response);
};

function parseCostco(response: ITextRecognitionResponse): {[key: string]: number} {
  const item_dict: {[key: string]: number} = {};
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
        if (isPrice(line_arr[j].text)) {
          let current_price = parseFloat(line_arr[j].text) - to_deduct
          prices.push(current_price)
          to_deduct = 0
          if (current_price > total) {
            total = current_price
          }
        }
        if (isDiscount(line_arr[j].text)) {
          to_deduct = parseFloat(line_arr[j].text.replace(/!$/, ""))
        }
      }
    }
  }

  let prices_out = []
  let total_hit = false
  let taxes = 0
  console.log(prices)
  for (var ind in prices) { // removes all prices that appear before total
    if (prices[ind] == total && !total_hit) {
      total_hit = true
      taxes = prices[Number(ind) + 1]
    } else if (!total_hit || (roundPrice(prices[ind] + taxes) == total) || prices[ind] == total) {
      continue
    }
    prices_out.push(prices[ind])
  }
  return prices_out
};

function parseCostco(response: ITextRecognitionResponse): {[key: string]: number} {
  let prices = grabPrices(response)
  let num_items = prices.length
  let item_count = 0
  let total_hit = false
  const item_dict: {[key: string]: number} = {};

  console.log(prices)
  for (var i = response.blocks.length - 1; i >= 0; i--) {
    var line_arr = response.blocks[i].lines
    if (line_arr != undefined) {
      for (var j = line_arr.length - 1; j >= 0; j--) {
        let current = line_arr[j].text
        if (total_hit && item_count < num_items && !isSubtotal(current) && !isStringDiscount(current)) {
          let clean_item = strClean(current)
          if (clean_item in item_dict) {
            item_dict[clean_item + String(item_count)] = prices[item_count]
            item_count++;
          } else {
            item_dict[clean_item] = prices[item_count]
            item_count++;
          }
        }
        else if (isTotal(current)) {
          item_dict["TOTAL"] = prices[item_count]
          item_count++;
          total_hit = true
        }
      }
    }
  }
  return item_dict
};

export function roundPrice(price: number): number {
  return Math.floor(price * 100) / 100;
}

export function checksum(dict: {[key: string]: number}): boolean {
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

const parser: IParser = {
    parseOutput,
    checksum
}

export default parser;