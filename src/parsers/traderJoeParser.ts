import { ITextRecognitionResponse } from "../components/mlkit";
import { ITraderJoe } from "./IParser";

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
function isNumberKey(key: string | number): key is number {
    return typeof key === 'number';
}
  
function printDict<T extends StringKeyNumberValueObject | NumberKeyStringArrayObject>(dict: T) {
    for (const key in dict) {
      if (isNumberKey(key)) {
        const values: string[] = dict[key];
        console.log(`Key: ${key}, Values: ${values.join(', ')}\n`);
      } else {
        console.log(`Key: ${key}, Value: ${dict[key]}`);
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
function isPriceTraderJoe(price: string): string {
    const re_price = /^[$]*(\d+(\.|\,)\d{2}).*$/;
    const re_price2 = /^(\d+(\.|\,)\d{2}) *[$]* *(\d+(\.|\,)\d{2}).*$/;
    let match = price.match(re_price2);
    if (match) {
        console.log("\"" + price + "\"" + " match2:" + match[3]);
        return match[3];
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
 *  2. for every price, find its closest item
 *     on the y axis that is not located near according
 *     to its width on the x axis
 *  3. fill a backwards dictionary of prices with their
 *     closest items
 *  4. flip the dictionary. Items with multiple prices
 *     (original and discounted), chooses the discounted
 *     price. (choosing is kinda unecessary for TraderJoes)
 * 
 * Context for Variebles:
 *  prices: [price, ycoor, xcoor, width][]
 *  items:  [item name, ycoor, xcoor][]
 *  widthScale: arbitrary scale value to prevent prices to match: xdist from price to item > widthScale*width
 *  regex2: used to check if ',' was read for a price. edge case
 *  regex3: remove any unnecessary items acquired from receipt
 *  regex4: used to remove any unnecessary items: may need to be implemented further
 * 
 * @param response 
 * @returns {[key: string]: number}
 */
export function pairItemtoPriceTraderJoe(response: ITextRecognitionResponse): {[key: string]: number} {
    let dict: NumberKeyStringArrayObject = {};
    const prices: [number, number, number, number][] = [];    
    const items: [string, number, number][] = [];
    const regex2 = /-?\d+\,\d{1,2}/g;
    let match;
    for (let i = 0; i < response.blocks.length; i++) {
        for (let j = 0; j < response.blocks[i].lines.length; j++) {
            let checkifNotPrice: boolean = true;
            let item = response.blocks[i].lines[j];
            const regex3 = 
                /.*saving.*|.*member.*|.*mermber.*|.*nenber.*/i;
            if (regex3.test(item.text)) {
                continue;
            }
            let str: string;
            if ((str = isPriceTraderJoe(item.text)) != "no match") {
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
            if (dict[prices[a][0]].includes(minitem[0])) {
                dict[prices[a][0]].push(minitem[0] + 
                    String(dict[prices[a][0]].filter(x => x === minitem[0]).length + 1));
            } else {
                dict[prices[a][0]].push(minitem[0]);
            }
        } else {
            dict[prices[a][0]] = [minitem[0]];
        }
    }
    
    console.log("number dict:");
    printDict(dict);

    let flipped: StringKeyNumberValueObject = {};
    for (const k in dict) {
        dict[k].forEach((v) => {
            if (v in flipped) {
                flipped[v] = Math.min(Number(k), flipped[v]);
            } else {
                flipped[v] = Number(k);
            }
        });
    }

    console.log("pre dict:");
    printDict(flipped);
    
    const regex4 = /.*change.*|.*points.*|.*price.*|.*snap.*|.*snp.*|.*master.*|.*debt.*|.*grocery.*|.*your.*|.*:.*|.*totsl.*|.*total.*/i;
    for (const ke in flipped) {
        if (regex4.test(ke)) {
        flipped = removeKey(flipped, ke);
        }
    }

    console.log("final dict:");
    printDict(flipped);

    return flipped;
};

const traderJoeParser: ITraderJoe = {
    pairItemtoPriceTraderJoe
}

export default traderJoeParser;