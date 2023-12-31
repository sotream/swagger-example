const express = require('express');
const log4js = require('log4js');

const { usersStorage } = require('../../store/users');
const { authMiddleware } = require('../../middlewares/auth');
const { getAccessToken } = require('../../utils/auth');

const usersRouter = express.Router();

const log = log4js.getLogger('authRouter');

log.level = 'debug';

// Create
usersRouter.post('/', (req, res) => {
  try {
    res.setHeader('x-api-version', 'v1');

    log.info('Create user request body', req.body);

    const createdUser = usersStorage.create(req.body);
    const accessToken = getAccessToken({ email: createdUser.email });

    res.status(201).json({
      status: 'ok',
      data: {
        ...createdUser,
        accessToken,
      },
    });
  } catch (error) {
    log.error('Create user error', error);

    res.status(error.code || 400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Read all users
usersRouter.get('/', [authMiddleware], (req, res) => {
  try {
    let users;
    const { filter, limit } = req.query;

    if (filter || limit) {
      users = usersStorage.findByFilter(filter, false, limit);
    } else {
      users = usersStorage.findAll();
    }

    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    res.setHeader('x-api-version', 'v1');

    res.status(200).json({
      status: 'ok',
      data: usersWithoutPassword,
    });
  } catch (error) {
    res.status(error.code || 400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Read by id
usersRouter.get('/:userId', [authMiddleware], (req, res) => {
  try {
    const { userId } = req.params;

    const user = usersStorage.findById(userId);

    res.setHeader('x-api-version', 'v1');

    res.status(200).json({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    res.status(error.code || 400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Update
usersRouter.put('/:userId', [authMiddleware], (req, res) => {
  try {
    const { userId } = req.params;

    res.setHeader('x-api-version', 'v1');

    res.status(200).json({
      status: 'ok',
      data: usersStorage.updateById(userId, req.body),
    });
  } catch (error) {
    res.status(error.code || 400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

// Delete
usersRouter.delete('/:userId', [authMiddleware], (req, res) => {
  try {
    const { userId } = req.params;

    usersStorage.deleteById(userId);

    res.setHeader('x-api-version', 'v1');

    res.sendStatus(204);
  } catch (error) {
    res.status(error.code || 400).json({
      status: 'error',
      data: {
        message: error.message || 'Internal error',
      },
    });
  }
});

module.exports = {
  usersRouter,
};
