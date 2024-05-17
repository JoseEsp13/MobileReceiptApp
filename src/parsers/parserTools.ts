import { ITextRecognitionResponse } from "../components/mlkit";

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
    const re_subtotal = /SUBTOTAL|S.*TOTAL|.*UBTOTAL.*|UBTOT|.*SUB.*TAL/;
    return re_subtotal.test(name)
}

function isNonsense(name: string): boolean {
    const re_nonsense = /^.*\d+$/;
    return re_nonsense.test(name)
}

function isChar(name: string): boolean {
    const re_char = /^.$/;
    return re_char.test(name)
}

function grabPrices(items: string[]): number[] {
    // Iterate through output bottom to top to grab all prices, return array of Floats in order from bottom to top. Also deducts discounts from apropriate items.

    let prices = []
    let to_deduct = 0
    let total_hit = false

    for (var j = items.length - 1; j >= 0; j--) {
        if (isPrice(items[j]) && total_hit) {
            let current_price = parseFloat(items[j]) - to_deduct
            prices.push(roundPrice(current_price))
            to_deduct = 0
        }
        if (isPrice(items[j]) && isTotal(items[j - 1]) || isTotal(items[j + 1]) && !total_hit) {
            prices.push(roundPrice(parseFloat(items[j])))
            total_hit = true
        }

        if (isDiscount(items[j])) {
            to_deduct = parseFloat(items[j].replace(/!$/, ""))
        }
    }

    prices.splice(2, 1);

    // console.log(prices)
    return prices
};

function secondaryPrices(items: string[]): number[] {
    // Iterate through output bottom to top to grab all prices, return array of Floats in order from bottom to top. Also deducts discounts from apropriate items.
  
    let prices: number[]
    prices = []
  
    for (var j = 0; j < items.length; j++) {
        if (isPrice(items[j])) {
            let current_price = parseFloat(items[j])
            prices.push(roundPrice(current_price))
        } else if (isDiscount(items[j])) {
            var last = prices.pop()
            if (last) {
                prices.push(last - parseFloat(items[j]))
            }
        } else if (isTotal(items[j])) {
            break
        }
    }
    let total = prices[prices.length - 1] + prices[prices.length - 2]

    prices.push(total)
    prices = prices.reverse()
  
    prices.splice(2, 1);
  
    // console.log(prices)
    return prices
  };

function merge(arr: [number, string][], l: number, m: number, r: number) {
    // Merge for mergesort SOURCE: https://www.geeksforgeeks.org/merge-sort/
    var n1 = m - l + 1;
    var n2 = r - m;

    let L = []
    let R = []

    for (var i = 0; i < n1; i++) {
        L[i] = arr[l + i];
    }
    for (var j = 0; j < n2; j++) {
        R[j] = arr[m + 1 + j];
    }
    var i = 0;
    var j = 0;
    var k = l;
    while (i < n1 && j < n2) {
        if (L[i][0] <= R[j][0]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

function mergeSort(arr: [number, string][], l: number, r: number) {
    // MergeSort for mergesort SOURCE: https://www.geeksforgeeks.org/merge-sort/
    if (l >= r) {
        return;
    }
    var m = l + Math.trunc((r - l) / 2);
    mergeSort(arr, l, m)
    mergeSort(arr, m + 1, r)
    merge(arr, l, m, r)
}

function genList(response: ITextRecognitionResponse): string[] {
    // Sorts the OCR output by rect.top values and returns items as list
    let items: [number, string][]
    items = []
    for (var i = 0; i < response.blocks.length; i++) {
        var line_arr = response.blocks[i].lines
        if (line_arr != undefined) {
            for (var j = 0; j < line_arr.length; j++) {
                let current = line_arr[j]
                // console.log(current.rect.top)
                // console.log(current.text)
                let pair: [number, string]
                pair = [current.rect.top, current.text]
                items.push(pair)
            }
        }
    }
    mergeSort(items, 0, items.length - 1);
    let items_out = []
    for (var i = 0; i < items.length; i++) {
        let s = items[i][1]
        if (typeof (s) == "string") {
            items_out.push(s)
        }
    }
    // console.log(items)
    // console.log(items_out)
    return items_out
}

function roundPrice(price: number): number {
    return Number(price.toFixed(2));
}

function checksum(dict: { [key: string]: number }): boolean {
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
        sum = parseTools.roundPrice(sum)
    }
    sum = parseTools.roundPrice(sum)
    let check = sum % max;
    if (check == 0) {
        return true
    }
    return false
}

const parseTools = {
    roundPrice,
    grabPrices,
    genList,
    isChar,
    isDiscount,
    isPrice,
    isStringDiscount,
    isSubtotal,
    isTotal,
    strClean,
    checksum,
    secondaryPrices,
    isNonsense
}

export default parseTools;