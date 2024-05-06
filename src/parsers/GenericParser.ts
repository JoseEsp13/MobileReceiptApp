import { ITextRecognitionResponse } from "../components/mlkit";
import { IParser } from "./IParser";
import { isPrice } from "./parser"
import { uri } from "../screens/ProcessImageScreen";


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

export function parseGeneric(response: ITextRecognitionResponse): {[key: string]: number} {
    const item_dict: {[key: string]: number} = {};
    var line_arr = response.blocks[i].lines
    console.log("Made it!")

    return item_dict
}


