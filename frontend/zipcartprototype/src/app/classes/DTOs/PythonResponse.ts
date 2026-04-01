export interface TopPrediction {
  productName: string;
  confidence: number;
}

export interface FruitsVegPredictResultsDTO {
  productName: string;
  confidence: number;
}

export interface PythonResponse {
  success: boolean;
  data: FruitsVegPredictResultsDTO;
  'topPredictions': TopPrediction[];
}
