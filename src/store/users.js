const log4js = require('log4js');

const { NotFoundError, ValidationError } = require('../common/errors');

class Users {
  #users = new Map();
  #id = 0;

  constructor(users) {
    this.log = log4js.getLogger('usersStorage');
    this.log.level = 'debug';

    for (const user of users) {
      this.#users.set(++this.#id, user);
    }
  }

  create(newUser) {
    if (!newUser.name || !newUser.email || !newUser.password) {
      throw new ValidationError('User params are not valid');
    }

    if (typeof newUser.name !== 'string' || newUser.name.length < 3 || newUser.name.length > 25) {
      throw new ValidationError('User name should be a string with length from 3 to 25 characters');
    }

    const usersArray = Array.from(this.#users);

    for (const [, user] of usersArray) {
      if (user.email === newUser.email) {
        throw new ValidationError('User already exists');
      }
    }

    const userId = ++this.#id;

    this.#users.set(userId, newUser);

    const createdUser = {
      ...newUser,
      id: userId,
    };

    delete createdUser.password;

    this.log.debug('User id=', userId, 'successfully created. Created user=', createdUser);

    return createdUser;
  }

  findAll() {
    const users = Array.from(this.#users).map(([id, user]) => ({
      ...user,
      id,
    }));

    this.log.debug('Stored users=', users);

    return users;
  }

  findById(userId, withPassword = false) {
    const userEntry = Array.from(this.#users).find(([id]) => Number(userId) === id);

    if (!userEntry) {
      throw new NotFoundError(`User with id '${userId}' not found`);
    }

    const [id, user] = userEntry;

    const userEntity = {
      ...user,
      id,
    };

    if (!withPassword) {
      delete userEntity.password;
    }

    this.log.debug('Get user by id=', userId, 'user=', userEntity);

    return userEntity;
  }

  findByFilter(filter = '', withPassword = false, limit) {
    const usersArray = Array.from(this.#users);
    const lowerCasedFilter = filter.toLowerCase();
    const filteredUserEntries = usersArray.filter(([, user]) => {
      const email = user.email.toLowerCase();
      const name = user.name.toLowerCase();

      return email.includes(lowerCasedFilter) || name.includes(lowerCasedFilter);
    });

    if (filteredUserEntries.length < 1) {
      throw new NotFoundError('No users found');
    }

    let users = filteredUserEntries.map(([id, { password, ...user }]) => {
      const result = {
        ...user,
        id,
      };

      if (withPassword) {
        result.password = password;
      }

      return result;
    });

    if (!isNaN(limit)) {
      users = users.slice(0, Number(limit));
    }

    this.log.debug('Get user by filter=', `'${filter}'`, 'users=', users);

    return users;
  }

  updateById(id, data) {
    const user = this.#users.get(Number(id));

    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    const newUser = { ...user, ...data };

    delete newUser.password;

    this.#users.set(Number(id), newUser);

    this.log.debug('Update user by user id=', id, 'data to update=', data, 'updated user=', newUser);

    return {
      ...newUser,
      id: Number(id),
    };
  }

  deleteById(id) {
    const isUserExists = this.#users.has(id);

    if (isUserExists) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    const deleteResult = this.#users.delete(Number(id));

    if (!deleteResult) {
      throw new Error('Error on user deletion');
    }

    this.log.debug('User with id=', id, 'removed successfully');

    return null;
  }

  clear() {
    this.#users.clear();
    this.#id = 0;
  }
}

const usersStorage = new Users([
  {
    name: 'John Dou',
    email: 'jdou@test.com',
    password: '12345678',
    age: 27,
  },
  {
    name: 'Jackie Smith',
    email: 'jackie.smith@test.com',
    password: '87654321',
    age: 31,
  },
]);

module.exports = {
  usersStorage,
};
