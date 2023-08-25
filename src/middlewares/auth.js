const jwt = require('jsonwebtoken');

const { JWT_PASSWORD } = require('../common/constants');

// eslint-disable-next-line consistent-return
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.get('authorization');

    if (!authHeader) {
      throw new Error('Wrong credentials');
    }

    const [authType, authToken] = authHeader.split(' ');

    if (authType !== 'Bearer') {
      throw new Error('Wrong authentication type');
    }

    const decoded = jwt.verify(authToken, JWT_PASSWORD);

    req.userData = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
};

module.exports = {
  authMiddleware,
};
