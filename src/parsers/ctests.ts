import { ITextRecognitionResponse } from "../components/mlkit";
import * as parseFunctions from "./parser";
import React, {useCallback, useEffect, useState} from 'react';
import {Image, useWindowDimensions, ScrollView} from 'react-native';
import {ProcessImageNavigationProps, ProcessImageRouteProps} from '../Navigator';
import { ViewOverlay } from '../components/ViewOverlay';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ViewDictionary } from '../components/ViewDictionary';
import { ViewReceipt } from '../components/ViewReceipt';
import { ViewResponse } from '../components/ViewResponse';
import parser from '../parsers/parser';

function buildValidDict(num: number): {[key: string]: number} {
    // Builds a valid dictionary that will pass the checksum if it is working as intended
    const dict: {[key: string]: number} = {}
    let sum = 0
    for (var i=1; i <= num; i++) {
        let new_price = parseFunctions.roundPrice(Math.random() * i * 10 + Math.random())
        sum += new_price
        dict["item" + String(i)] = new_price;
    }
    dict["total"] = parseFunctions.roundPrice(sum)
    return dict;
};

function buildInvalidDict(num: number): {[key: string]: number} {
    // Builds an invalid dictionary that will fail the checksum if it is working as intended
    const dict: {[key: string]: number} = {}
    let sum = 0
    for (var i=1; i <= num; i++) {
        let new_price = parseFunctions.roundPrice(Math.random() * i * 10 + Math.random())
        sum += new_price
        dict["item" + String(i)] = new_price;
    }
    dict["total"] = parseFunctions.roundPrice(sum) - Math.random() * (num)
    return dict;
};

export function testChecksum(num: number): number {
    // tests checksum num times on num valid dictionaries, and num invalid dictionaries.
    let dict: {[key: string]: number} = {}
    let num_tests = num
    let test_passed = 0
    for (var i=1; i <= num_tests; i++) {
        dict = buildValidDict(i)
        console.log("validDict#" + String(i) + "=")
        console.log(dict)
        var res = parseFunctions.checksum(dict)
        console.log("validDict#" + String(i) + " checksum=" + res)
        if (res) {
            test_passed++
        }
        dict = buildInvalidDict(i)
        console.log("invalidDict#" + String(i) + "=")
        console.log(dict)
        res = parseFunctions.checksum(dict)
        console.log("invalidDict#" + String(i) + " checksum=" + res)
        if (!res) {
            test_passed++
        }
    }
    console.log("testChecksum passed " + test_passed + " tests of " + num_tests*2)
    return test_passed
};

const processImage = async (url: string) => {
    if (url) {
      try {
        // Send a request to Google's ML Kit
        const response = await recognizeImage(url);

        // If the response contains data
        if (response?.blocks?.length > 0) {

          // Process response here
          setResponse(response);                            // Save the response
          setAspectRatio(response.height / response.width); // Set the aspect ratio of the returned data 

          // TO DO: What else do we want to do with the ML Kit response?
          // console.log(getStore(response))
          // console.log(isPrice("4.43"))

          let dict = parser.parseOutput(response)
          console.log(dict)
          if (dict != undefined) {
            console.log(parser.checksum(dict))
          }
        }
    } catch (error) {
        console.error(error);
      }
    }
  };