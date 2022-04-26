class HttpError extends Error {
  constructor(message, errorCode, obj) {
    // add a "message" property
    super(message);
    // adds a "code" property
    this.code = errorCode;
    this.obj = obj;
  }
}

module.exports = HttpError;