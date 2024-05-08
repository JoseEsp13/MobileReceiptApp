import { ITextRecognitionResponse } from "../components/mlkit";
import { parseGeneric } from "./GenericParser";
import { IParser } from "./IParser";
import safewayParser from './safewayParser';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useEffect, useState } from 'react';

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
  } else {
    parseGeneric(setResponse);
  }
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

function roundPrice(price: number): number {
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

const parser: IParser = {
    parseOutput,
    checksum
}

export default parser;