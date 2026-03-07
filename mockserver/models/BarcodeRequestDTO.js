class BarCodeRequest {
  constructor(isValid, text, format, contentType) {
    this.isValid = isValid;
    this.text = text;
    this.format = format;
    this.contentType = contentType;
  }
}

export default BarCodeRequest;
