/* eslint-disable max-classes-per-file */

class NotFoundError extends Error {
  constructor(message = 'Entity not found', code = 404) {
    super(message);

    this.name = 'NotFoundError';
    this.code = code;
  }
}

class NotAuthorizedError extends Error {
  constructor(message = 'Wrong credentials', code = 401) {
    super(message);

    this.name = 'NotAuthorizedError';
    this.code = code;
  }
}

module.exports = {
  NotFoundError,
  NotAuthorizedError,
};
