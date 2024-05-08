import { ITextRecognitionResponse } from "../components/mlkit"

export interface IParser {
    parseOutput: (response: ITextRecognitionResponse, setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>) => {[key: string]: number} | undefined,
    checksum: (dict: {[key: string]: number}) => boolean
}

export interface ISafeway {
    pairItemtoPriceSafeway: (reponse: ITextRecognitionResponse) => {[key: string]: number}
}