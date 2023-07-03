// class contructor client error
class ClientError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ClientError';
    }
}

// exports module client error
module.exports = ClientError;
