import { ITextRecognitionResponse } from "../components/mlkit";
import { ISafeway } from "./IParser";
import parseTools from "./parserTools";

interface StringKeyNumberValueObject {
    [key: string]: number;
}

interface StringKeyStringValueObject {
    [key: string]: string[];
}

interface StringKeyPricePosObjArrayObj {
    [item: string]: PricePositionObject
}

interface PricePositionObject {
    price: number,
    xCoor: number,
    yCoor: number,
    width: number
}

interface ItemPositionObject {
    item: string,
    xCoor: number,
    yCoor: number
}

function removeKey<T extends StringKeyNumberValueObject | StringKeyStringValueObject>(dict: T, key: keyof T): Omit<T, keyof T> {
    const { [key]: removedKey, ...newDict } = dict;
    return newDict;
}

function printDict<T extends StringKeyNumberValueObject | StringKeyStringValueObject | StringKeyPricePosObjArrayObj>(dict: T) {
    for (const key in dict) {
        const value = dict[key];
        if (Array.isArray(value)) {
            console.log(`Key: ${key}, Values: ${value.join(', ')}\n`);
        } else {
            console.log(`Key: ${key}, Value: ${value}`);
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
function isPriceSafeway(price: string): string {
    const re_price = /^([-]{0,1}\d+(\.|\,)\d{2}).{0,3}$/;
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
}

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
 *     price.
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
function pairItemtoPriceSafeway(response: ITextRecognitionResponse): { [key: string]: number } {
    let dict: { [key: string]: string[] } = {};
    const prices: PricePositionObject[] = [];
    const items: ItemPositionObject[] = [];
    const regex2 = /-?\d+\,\d{1,2}/g;
    let match;
    for (let i = 0; i < response.blocks.length; i++) {
        for (let j = 0; j < response.blocks[i].lines.length; j++) {
            let checkifNotPrice: boolean = true;
            let item = response.blocks[i].lines[j];
            const regex3 =
                /.*saving.*|.*total.*|.*member.*|.*mermber.*|.*nenber.*/i;
            if (regex3.test(item.text)) {
                continue;
            }
            let str: string;
            if ((str = isPriceSafeway(item.text)) != "no match") {
                if (regex2.test(str)) {
                    str = str.replace(/,/g, '.');
                }
                const priceObj: PricePositionObject = {
                    price: Number(str),
                    xCoor: item.rect.left,
                    yCoor: item.rect.top,
                    width: item.rect.width
                };
                prices.push(priceObj);
                checkifNotPrice = false;
            }
            if (checkifNotPrice && !(/^\d+$/.test(item.text))) {
                const itemObj: ItemPositionObject = {
                    item: item.text.replace(/^[\d|\?]*[\s*%]*|^\W+/, ''),
                    xCoor: item.rect.left,
                    yCoor: item.rect.top
                };
                items.push(itemObj);
            }
        }
    }

    let widthScale: number = 2.5;
    for (let a = 0; a < prices.length; a++) {
        if (prices[a].price == 0) {
            continue;
        }
        let minitem: ItemPositionObject = items[0];
        for (let b = 0; b < items.length; b++) {
            if (Math.abs(items[b].xCoor - prices[a].xCoor) > widthScale * prices[a].width) {
                let newval = Math.abs(prices[a].yCoor - items[b].yCoor);
                if (newval < Math.abs(prices[a].yCoor - minitem.yCoor)) {
                    minitem = items[b];
                }
            }
        }
        const keyObj = JSON.stringify(prices[a]);
        if (keyObj in dict) {
            dict[keyObj].push(minitem.item);
        } else {
            dict[keyObj] = [minitem.item];
        }
    }

    console.log("number dictionary");
    printDict(dict);

    let yMargin = 15;
    let flipped: StringKeyPricePosObjArrayObj = {};
    for (const k in dict) {
        dict[k].forEach((v) => {
            const parsedKeyPrice: PricePositionObject = JSON.parse(k);
            let liquidV = v;
            while (liquidV in flipped) {
                console.log(liquidV + " IN FLIPPED");
                if (Math.abs(flipped[liquidV].yCoor - parsedKeyPrice.yCoor) < yMargin) {
                    if (parsedKeyPrice.xCoor > flipped[liquidV].xCoor) {
                        flipped[liquidV] = parsedKeyPrice;
                        break;
                    }
                } else {
                    liquidV = liquidV + "#";
                    console.log("NEW V: " + liquidV);
                }
            }
            if (!(liquidV in flipped)) {
                console.log("NEW VALUE: " + liquidV);
                flipped[liquidV] = parsedKeyPrice;
            }
        });
    }

    console.log("flipped");
    printDict(flipped);

    let result: StringKeyNumberValueObject = {};
    for (let cpy in flipped) {
        result[cpy] = flipped[cpy].price;
    }

    console.log("pre dict");
    printDict(result);

    let keyMax: string = "";
    let total: number = 0;
    const regex4 = /.*change.*|.*points.*|.*price.*|.*pay.*|.+balance.*|.*snap.*|.*snp.*|.*sngp.*|.*master.*|.*debt.*|.*grocery.*|.*your.*|.*:.*|.*totsl.*|.*total.*|.*tatal.*|.*value.*|.*visa.*|.*debit.*/i;
    for (const ke in result) {
        if (regex4.test(ke)) {
            console.log(ke + " removed");
            result = removeKey(result, ke);
            continue;
        }
        if (result[ke] >= total) {
            total = result[ke];
            keyMax = ke;
        }
    }
    result["TOTAL"] = result[keyMax];
    result = removeKey(result, keyMax);
    console.log("REMOVED " + keyMax);

    if (!("TAX" in result)) {
        result["TAX"] = 0;
        console.log("APPENDED TAX TO FLIPPED")
    }

    console.log("final dict");
    printDict(result);

    return result;
}

const safewayParser: ISafeway = {
    pairItemtoPriceSafeway
}

export default safewayParser;