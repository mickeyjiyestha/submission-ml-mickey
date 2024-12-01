class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputError";
    this.output = { statusCode: 400 };
  }
}

module.exports = InputError;
