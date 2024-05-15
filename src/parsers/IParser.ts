import { ITextRecognitionResponse } from "../components/mlkit"

export interface IParserResult {
    [key: string]: number
}

export interface IParser {
    parseOutput: (response: ITextRecognitionResponse, setResponse: React.Dispatch<React.SetStateAction<ITextRecognitionResponse | undefined>>) => Promise<IParserResult | undefined>,
    checksum: (dict: IParserResult) => boolean
}

export interface ISafeway {
    pairItemtoPriceSafeway: (reponse: ITextRecognitionResponse) => IParserResult
}

export interface ITraderJoe {
    pairItemtoPriceTraderJoe: (reponse: ITextRecognitionResponse) => IParserResult
}

export interface IMcDonalds {
    pairItemtoPriceMcDonalds: (resposne: ITextRecognitionResponse) => IParserResult
}