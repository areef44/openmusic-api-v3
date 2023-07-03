const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

class UsersValidator {
  validateUserPayload = (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  };
}
module.exports = { UsersValidator };
