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

export const recognizeImage = (url: string): Promise<ITextRecognitionResponse> => {
    return TextRecognitionModule.recognizeImage(url);
}