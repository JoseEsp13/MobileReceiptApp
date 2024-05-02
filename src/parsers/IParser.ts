import { ITextRecognitionResponse } from "../components/mlkit"

export interface IParser {
    parseOutput: (response: ITextRecognitionResponse) => {[key: string]: number} | undefined,
    checksum: (dict: {[key: string]: number}) => boolean
}