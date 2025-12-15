/**
 * mlkit index.ts
 * 
 * Interface for interacting with the ML Kit native module.
 */

import {NativeModules} from 'react-native';

const { TextRecognitionModule } = NativeModules;

export type ITextRecognitionResponse = {
    width: number,
    height: number,
    blocks: Block[],
}

export type Block = {
    text: string,
    rect: Rect,
    lines: Line[],
}

export type Rect = {
    left: number,
    top: number,
    height: number,
    width: number,
}

export type Line = {
    text: string,
    rect: Rect
}

const recognizeImage = (url: string): Promise<ITextRecognitionResponse> => {
    return TextRecognitionModule.recognizeImage(url);
}

export interface IMLKit {
    recognizeImage: (url: string) => Promise<ITextRecognitionResponse>
}

const MLKit: IMLKit = {
    recognizeImage
}

export default MLKit;